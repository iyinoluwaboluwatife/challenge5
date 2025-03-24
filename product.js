fetch('data.json')
//.then() is a method that returns a Promise. It's used to handle the response from the fetch API.
    .then(response => response.json())
    //assign the JSON data to a global variable named data on the window object,which makes the data accessible from anywhere in the code
    .then(data=> {
        window.menuData = data;

        let addToCart = document.querySelectorAll('.wafflebtn,.cremebtn,.macaronbtn,.tiramisubtn,.baklavabtn,.piebtn,.cakebtn,.browniebtn,.pannabtn');
        let emptyCart = document.querySelector('.emptycart');
        let selectedCart = document.querySelector('.cart');

        // Get the cart data to display it in the modal page
        let confirmButton = document.querySelector('.confirmorder');
        confirmButton.addEventListener('click', function() {
            let cartData = [];
            let cartMenuItems = document.querySelectorAll('.cartmenu1');
            cartMenuItems.forEach(item => {
            let category = item.getAttribute('data-category');
            let count = parseInt(item.querySelector('.number').textContent.replace('x', ''));
            let itemData = window.menuData.find(item => item.category === category);
            cartData.push({ category, count, itemData });
            });
            //Create a query string
            let url = 'modal.html';
            let queryString = '';
            cartData.forEach((item, index) => {
            queryString += `item${index}=${JSON.stringify(item)}&`;
            });
            url += '?' + queryString;
            window.open(url, '_blank');
        });
        function updateAside(itemData, count) {
            let newMenu;
            let asideElement = document.querySelector('aside');
            let cartElement = asideElement.querySelector('.cart');
            let orderTotalElement = cartElement.querySelector('.ordertotal');
            // Check if the menu item already exists in the cart
            let existingMenuItem = cartElement.querySelector(`.cartmenu1[data-category="${itemData.category}"]`);
            if (existingMenuItem) {
                //Update the count if the item already exists
                let countElement = existingMenuItem.querySelector('.number');
                countElement.textContent = `${count}x`;
                let totalAmountElement = existingMenuItem.querySelector('.totalamount');
                totalAmountElement.textContent = `$${itemData.price * count}`;
                return;
            } else {
                // Create a new menu item element if it doesn't exist
                newMenu = document.createElement('article');
                newMenu.classList.add('cartmenu1');
                newMenu.setAttribute('data-category', itemData.category);
                newMenu.innerHTML = `
                <article class="menu1">
                    <h2>${itemData.name}</h2>
                    <span>
                    <h3 class="number">${count}x</h3>
                    @
                    <p class="amount">$${itemData.price}</p>
                    <p class="totalamount">$${itemData.price * count}</p>
                    </span>
                </article>
                <h3 class="cancel">X</h3>
                `;
                cartElement.insertBefore(newMenu, orderTotalElement);
                let cancelButton =newMenu.querySelector('.cancel');
                cancelButton.addEventListener('click',function (){
                    let category = newMenu.getAttribute('data-category');
                    let countLabel = document.querySelector(`#${category.toLowerCase()}label`);
                    countLabel.textContent = '0';
                    itemCounts[category] = 0; // Reset itemCounts
                    newMenu.remove();
                    updateCartCount();
                    updateTotalOrder();
                });
            }
        }
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
        function updateCartCount() {
            let totalCount = 0;
            let countLabels = document.querySelectorAll('#wafflelabel,#cremebruleelabel,#macaronlabel,#tiramisulabel,#baklavalabel,#pielabel,#cakelabel,#brownielabel,#pannacottalabel');
            countLabels.forEach(label => {
            let count = parseInt(label.textContent);
            totalCount += count;
            });
            let cartCount = document.querySelector('.cartcount');
            cartCount.textContent = totalCount;
            if (totalCount === 0) {
                emptyCart.style.display = 'block';
                selectedCart.style.display = 'none';
            } else {
                emptyCart.style.display = 'none';
                selectedCart.style.display = 'block';
            }
        }
        let itemCounts = {}; 
        addToCart.forEach(button => {
            button.addEventListener('click', function() {
                // to get the corresponding count element
                let count = button.parentNode.querySelectorAll('.wafflecount,.cremecount,.macaroncount,.tiramisucount,.baklavacount,.piecount,.cakecount,.browniecount,.pannacount');
                count.forEach(element => {
                    element.style.visibility = 'visible'});
                let menu = button.parentNode.querySelectorAll('.wafimg,.cremeimg,.macaronimg,.tiramisuimg,.baklavaimg,.pieimg,.cakeimg,.brownieimg,.pannaimg ');
                menu.forEach(element => {
                    element.style.border = '2px solid hsl(14, 83%, 35%)'
                });
                button.style.visibility = 'hidden';

                let countDecrease = document.querySelectorAll('#waffledecrease,#cremedecrease,#macarondecrease,#tiramisudecrease,#baklavadecrease,#piedecrease,#cakedecrease,#browniedecrease,#pannadecrease');
                let countIncrease = document.querySelectorAll('#waffleincrease,#cremeincrease,#macaronincrease,#tiramisuincrease,#baklavaincrease,#pieincrease,#cakeincrease,#brownieincrease,#pannaincrease');
                let category = button.getAttribute('data-category');
                let itemData = window.menuData.find(item => item.category === category);
                
                if (!itemCounts[category]) {
                    itemCounts[category] = 0;
                }
                countDecrease.forEach(button =>{
                    button.addEventListener('click', function(){
                        itemCounts[category] = Math.max(itemCounts[category] - 1, 0);//you cant decrease it less than 0
                         // selecting the count label element specifically for the current item. the .replace is for the two-word categories that have space
                        let countLabel = button.parentNode.querySelector(`#${category.toLowerCase()}label`);
                        countLabel.textContent = itemCounts[category];
                        updateAside(itemData,itemCounts[category]);
                        updateCartCount();
                        updateTotalOrder();
                        emptyCart.style.display = 'none';
                        selectedCart.style.display = 'block';
                    });
                });
                countIncrease.forEach(button =>{
                    button.addEventListener('click', function(){
                        itemCounts[category] += 1;
                         // selecting the count label element specifically for the current item
                        let countLabel = button.parentNode.querySelector(`#${category.toLowerCase()}label`);
                        countLabel.textContent = itemCounts[category];
                        updateAside(itemData,itemCounts[category]);
                        updateCartCount();
                        updateTotalOrder();
                        emptyCart.style.display = 'none';
                        selectedCart.style.display = 'block';
                    });
                });
            });
        });
    })
    .catch(error => console.error('Error loading JSON data:', error));
