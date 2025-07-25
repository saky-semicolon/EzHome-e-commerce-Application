$(document).ready(function() {
    const productList = $('#product-list');

    function displayProducts() {
        productList.empty();
        window.allProducts.forEach(product => {
            const productRow = `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.product_category}</td>
                    <td>$${product.price_sgd}</td>
                    <td><input type="checkbox" ${product.qty > 0 ? 'checked' : ''}></td>
                    <td>
                        <button class="btn btn-sm btn-primary">Edit</button>
                        <button class="btn btn-sm btn-danger">Delete</button>
                    </td>
                </tr>
            `;
            productList.append(productRow);
        });
    }

    displayProducts();
});