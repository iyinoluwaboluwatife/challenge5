document.addEventListener('DOMContentLoaded', function() {
    let urlParams = new URLSearchParams(window.location.search);
    let cartData = [];
    for (let [key, value] of urlParams) {
        if (key.startsWith('item')) {
            cartData.push(JSON.parse(value));
        }
    }
    let modalContent = document.querySelector('.menucalculation');
    cartData.forEach(item => {
    let menuItem = document.createElement('article');
    menuItem.classList.add('cartmenu1');
    menuItem.innerHTML =`
        <section class="menu1img">
            <img src="${item.itemData.image.thumbnail}" alt="${item.itemData.name}">
            <article class="menu1">
                <h2>${item.itemData.name}</h2>
                <span>
                <h3 class="number">${item.count}x</h3>@
                <p class="amount">$${item.itemData.price}</p>
                </span>
            </article>
        </section>
        <p class="totalamount">$${item.itemData.price * item.count}</p>       
    `;
    let orderTotalElement = modalContent.querySelector('.ordertotal');
    modalContent.insertBefore(menuItem, orderTotalElement);
    updateTotalOrder()
    });
});
function updateTotalOrder() {
    let totalOrder = 0;
    let cartMenuItems = document.querySelectorAll('.cartmenu1');
    cartMenuItems.forEach(item => {
      let totalAmountElement = item.querySelector('.totalamount');
      let totalAmount = parseFloat(totalAmountElement.textContent.replace('$', ''));
      totalOrder += totalAmount;
    });
    let totalOrderElement = document.querySelector('.totalorder');
    totalOrderElement.textContent = `$${totalOrder.toFixed(2)}`;
}
let startNewOrderButton = document.querySelector('.confirmorder2 a');
startNewOrderButton.addEventListener('click', function() {
    // Redirect the user to the index.html page
    window.location.href = 'index.html';
});