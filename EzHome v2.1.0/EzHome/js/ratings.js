// Rating System for EzHome
class RatingManager {
    constructor() {
        this.ratings = this.loadRatings();
        this.userRatings = this.loadUserRatings();
    }

    // Load all product ratings from localStorage
    loadRatings() {
        const ratings = localStorage.getItem('productRatings');
        return ratings ? JSON.parse(ratings) : {};
    }

    // Load user-specific ratings from localStorage
    loadUserRatings() {
        const userRatings = localStorage.getItem('userRatings');
        return userRatings ? JSON.parse(userRatings) : {};
    }

    // Save ratings to localStorage
    saveRatings() {
        localStorage.setItem('productRatings', JSON.stringify(this.ratings));
    }

    // Save user ratings to localStorage
    saveUserRatings() {
        localStorage.setItem('userRatings', JSON.stringify(this.userRatings));
    }

    // Add or update a rating for a product
    addRating(productId, userId, rating, review = '') {
        // Initialize product ratings if not exists
        if (!this.ratings[productId]) {
            this.ratings[productId] = {
                ratings: [],
                averageRating: 0,
                totalRatings: 0,
                distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            };
        }

        // Check if user already rated this product
        const existingRatingIndex = this.ratings[productId].ratings.findIndex(r => r.userId === userId);
        
        const ratingData = {
            userId: userId,
            rating: rating,
            review: review,
            date: new Date().toISOString(),
            verified: this.isVerifiedPurchase(productId, userId)
        };

        if (existingRatingIndex >= 0) {
            // Update existing rating
            const oldRating = this.ratings[productId].ratings[existingRatingIndex].rating;
            this.ratings[productId].ratings[existingRatingIndex] = ratingData;
            
            // Update distribution
            this.ratings[productId].distribution[oldRating]--;
            this.ratings[productId].distribution[rating]++;
        } else {
            // Add new rating
            this.ratings[productId].ratings.push(ratingData);
            this.ratings[productId].totalRatings++;
            this.ratings[productId].distribution[rating]++;
        }

        // Recalculate average rating
        this.updateAverageRating(productId);

        // Update user ratings tracking
        if (!this.userRatings[userId]) {
            this.userRatings[userId] = {};
        }
        this.userRatings[userId][productId] = {
            rating: rating,
            review: review,
            date: ratingData.date
        };

        // Save to localStorage
        this.saveRatings();
        this.saveUserRatings();

        // Update product rating in products array
        this.updateProductRating(productId);

        return true;
    }

    // Update average rating for a product
    updateAverageRating(productId) {
        const productRatings = this.ratings[productId];
        if (productRatings && productRatings.ratings.length > 0) {
            const sum = productRatings.ratings.reduce((acc, r) => acc + r.rating, 0);
            productRatings.averageRating = Math.round((sum / productRatings.ratings.length) * 10) / 10;
        } else {
            productRatings.averageRating = 0;
        }
    }

    // Update the rating in the products array
    updateProductRating(productId) {
        if (window.products) {
            const product = window.products.find(p => p.id == productId);
            if (product && this.ratings[productId]) {
                product.rating = this.ratings[productId].averageRating;
                product.totalRatings = this.ratings[productId].totalRatings;
            }
        }
    }

    // Get rating for a product (only if there are actual customer ratings)
    getProductRating(productId) {
        const rating = this.ratings[productId];
        // Only return rating data if there are actual customer ratings from verified purchases
        if (rating && rating.totalRatings > 0) {
            return rating;
        }
        return null;
    }

    // Get user's rating for a specific product
    getUserRating(productId, userId) {
        return this.userRatings[userId] && this.userRatings[userId][productId] || null;
    }

    // Check if user has purchased this product (verified purchase)
    isVerifiedPurchase(productId, userId) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        return orders.some(order => 
            order.user === userId && 
            order.items.some(item => item.id == productId) &&
            ['completed', 'payment-collected'].includes(order.status)
        );
    }

    // Check if user can rate this product (must have purchased it)
    canUserRate(productId, userId) {
        return this.isVerifiedPurchase(productId, userId);
    }

    // Get all ratings for a product with user details (only if there are verified purchases)
    getProductRatingsWithDetails(productId) {
        const productRatings = this.ratings[productId];
        if (!productRatings || productRatings.totalRatings === 0) return null;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const ratingsWithDetails = productRatings.ratings.map(rating => {
            const user = users.find(u => u.username === rating.userId);
            return {
                ...rating,
                userName: user ? user.username : 'Anonymous',
                userInitials: user ? this.getUserInitials(user.username) : 'A'
            };
        });

        return {
            ...productRatings,
            ratings: ratingsWithDetails
        };
    }

    // Get user initials for display
    getUserInitials(username) {
        return username.charAt(0).toUpperCase() + (username.charAt(1) || '').toUpperCase();
    }

    // Generate star display HTML
    generateStarDisplay(rating, size = 'sm', interactive = false, productId = null) {
        let starsHtml = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                starsHtml += `<i class="fas fa-star text-warning${interactive ? ' rating-star' : ''}" ${interactive ? `data-rating="${i}" data-product-id="${productId}"` : ''}></i>`;
            } else if (i === fullStars + 1 && hasHalfStar) {
                starsHtml += `<i class="fas fa-star-half-alt text-warning${interactive ? ' rating-star' : ''}" ${interactive ? `data-rating="${i}" data-product-id="${productId}"` : ''}></i>`;
            } else {
                starsHtml += `<i class="far fa-star text-muted${interactive ? ' rating-star' : ''}" ${interactive ? `data-rating="${i}" data-product-id="${productId}"` : ''}></i>`;
            }
        }
        
        return starsHtml;
    }

    // Generate interactive rating stars for rating input
    generateInteractiveStars(currentRating = 0, productId = null) {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            const isActive = i <= currentRating;
            starsHtml += `<i class="fas fa-star rating-input-star ${isActive ? 'text-warning' : 'text-muted'}" 
                             data-rating="${i}" 
                             data-product-id="${productId}"
                             style="cursor: pointer; font-size: 1.5em; margin: 2px;"></i>`;
        }
        return starsHtml;
    }

    // Initialize ratings for existing products (clean slate - no default ratings)
    initializeProductRatings() {
        // Just ensure the rating manager is ready, but don't create any default ratings
        // Products will only show ratings when customers actually rate them after purchase
        console.log('Rating manager initialized - products will show ratings only after customer purchases and ratings');
    }
}

// Initialize global rating manager
window.ratingManager = new RatingManager();

// Initialize ratings when DOM is ready
$(document).ready(function() {
    window.ratingManager.initializeProductRatings();
});
