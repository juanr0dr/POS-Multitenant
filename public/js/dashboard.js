document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/index.html'; return; }

    document.getElementById('tenantNameDisplay').textContent = localStorage.getItem('storeName') || 'Workstation';

    setInterval(() => {
        document.getElementById('currentTime').textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }, 1000);

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.clear(); window.location.href = '/index.html';
    });

    let catalog = [];
    let activeOrders = [];
    let currentCategory = 'Food';
    let currentCheck = null;
    let selectedItemIndex = -1;
    const TOTAL_TABLES = 12;

    const initializeApp = async () => {
        const resCat = await fetch('/api/products', { headers: { 'Authorization': `Bearer ${token}` } });
        catalog = await resCat.json();
        renderGrid();
        loadFloorPlan();
    };

    const loadFloorPlan = async () => {
        const resOrd = await fetch('/api/orders', { headers: { 'Authorization': `Bearer ${token}` } });
        const allOrders = await resOrd.json();
        activeOrders = allOrders.filter(o => o.status === 'Abierta' || o.status === 'Pendiente');

        const grid = document.getElementById('tableGrid');
        grid.innerHTML = '';

        for (let i = 1; i <= TOTAL_TABLES; i++) {
            const tableName = `Table ${i}`;
            const existingOrder = activeOrders.find(o => o.tableName === tableName);
            const btn = document.createElement('div');
            btn.className = `restaurant-table shadow`;

            if (existingOrder) {
                btn.classList.add(existingOrder.status === 'Pendiente' ? 'table-pending' : 'table-occupied');
                btn.innerHTML = `<div>${tableName}</div><div class="table-amount">$${existingOrder.totalAmount.toFixed(2)}</div>`;
                btn.onclick = () => openTable(existingOrder);
            } else {
                btn.classList.add('table-free');
                btn.innerHTML = `<div>${tableName}</div>`;
                btn.onclick = () => openTable({ tableName, isNew: true });
            }
            grid.appendChild(btn);
        }
    };

    window.openTable = (orderData) => {
        document.getElementById('floorPlanSection').style.display = 'none';
        document.getElementById('posSection').style.display = 'block';
        cancelPayment();

        if (orderData.isNew) {
            currentCheck = { _id: null, tableName: orderData.tableName, checkId: `CHK-${Math.floor(Math.random() * 9000) + 1000}`, items: [] };
        } else {
            currentCheck = JSON.parse(JSON.stringify(orderData));
        }

        selectedItemIndex = -1;
        document.getElementById('currentTableName').textContent = currentCheck.tableName;
        document.getElementById('currentCheckId').textContent = currentCheck.checkNumber || currentCheck.checkId;
        renderTicket();
    };

    window.returnToMap = () => {
        document.getElementById('posSection').style.display = 'none';
        document.getElementById('floorPlanSection').style.display = 'block';
        loadFloorPlan();
    };

    window.filterCategory = (cat) => {
        currentCategory = cat;
        document.querySelectorAll('.simphony-cat-btn').forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
        renderGrid();
    };

    const renderGrid = () => {
        const grid = document.getElementById('posProductGrid');
        grid.innerHTML = '';
        catalog.filter(p => p.category === currentCategory).forEach(p => {
            const btn = document.createElement('div');
            btn.className = 'simphony-item-btn';
            btn.innerHTML = `<div class="px-1">${p.name}</div><div class="text-white-50 mt-1">${p.price.toFixed(2)}</div>`;
            btn.onclick = () => addItemToCheck(p);
            grid.appendChild(btn);
        });
    };

    const addItemToCheck = (product) => {
        currentCheck.items.push({ productId: product._id, name: product.name, price: product.price, quantity: 1, total: product.price });
        selectedItemIndex = currentCheck.items.length - 1;
        renderTicket();
    };

    window.selectItem = (index) => { selectedItemIndex = index; renderTicket(); };

    window.voidItem = () => {
        if (currentCheck.items.length === 0) return;
        if (selectedItemIndex === -1) return alert("Please select an item (highlight blue) to void.");

        if (confirm("Confirm Void Item?")) {
            currentCheck.items.splice(selectedItemIndex, 1);
            selectedItemIndex = -1;
            renderTicket();
        }
    };

    const renderTicket = () => {
        const tbody = document.getElementById('ticketBody');
        let total = 0;

        if (currentCheck.items.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" class="text-center text-secondary py-5 mt-5">Add items from the menu</td></tr>`;
            document.getElementById('ticketSubtotal').textContent = '0.00';
            document.getElementById('ticketTotal').textContent = '0.00';
            return;
        }

        tbody.innerHTML = '';
        currentCheck.items.forEach((item, i) => {
            total += item.total;
            const isSelected = i === selectedItemIndex ? 'selected' : '';
            tbody.innerHTML += `
                <tr class="ticket-item-row ${isSelected}" onclick="selectItem(${i})">
                    <td width="15%" class="fw-bold text-center">${item.quantity}</td>
                    <td width="60%">${item.name}</td>
                    <td width="25%" class="text-end">${item.total.toFixed(2)}</td>
                </tr>
            `;
        });

        document.getElementById('ticketSubtotal').textContent = total.toFixed(2);
        document.getElementById('ticketTotal').textContent = total.toFixed(2);
        document.getElementById('ticketItemsContainer').scrollTop = document.getElementById('ticketItemsContainer').scrollHeight;
    };

    window.saveCheck = async (targetStatus) => {
        if (currentCheck.items.length === 0 && !currentCheck._id) {
            return alert("Check is empty. Add items first.");
        }

        const totalAmount = currentCheck.items.reduce((acc, curr) => acc + curr.total, 0);
        let finalStatus = targetStatus;

        // **AQUÍ ESTÁ LA MAGIA**: Forzar la anulación si la mesa existía y ahora está vacía
        if (currentCheck.items.length === 0 && currentCheck._id) {
            finalStatus = 'Anulada';
        }

        const payload = {
            tableName: currentCheck.tableName,
            checkNumber: currentCheck.checkNumber || currentCheck.checkId,
            items: currentCheck.items,
            totalAmount: totalAmount,
            status: finalStatus
        };

        const method = currentCheck._id ? 'PUT' : 'POST';
        const url = currentCheck._id ? `/api/orders/${currentCheck._id}` : '/api/orders';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const savedData = await res.json();
                if (method === 'POST') currentCheck._id = savedData.order._id;

                if (finalStatus === 'Anulada') {
                    alert('Todos los ítems fueron anulados. La mesa ha sido cancelada.');
                    // Limpia currentCheck y fuerza la recarga del mapa inmediatamente
                    currentCheck = null;
                    returnToMap();
                } else {
                    alert(`Check Saved to Kitchen. \nStatus: ${targetStatus}`);
                }
            } else {
                alert('Error al guardar la orden.');
            }
        } catch (error) {
            alert('Connection error.');
        }
    };

    let typedAmount = "";

    window.openPaymentScreen = () => {
        if (currentCheck.items.length === 0) return alert("Check is empty.");
        document.getElementById('orderModeLayout').classList.remove('d-flex');
        document.getElementById('orderModeLayout').classList.add('d-none');
        document.getElementById('paymentModeLayout').classList.remove('d-none');
        document.getElementById('paymentModeLayout').classList.add('d-flex');

        typedAmount = document.getElementById('ticketTotal').textContent;
        document.getElementById('paymentAmountInput').value = "$" + typedAmount;
    };

    window.cancelPayment = () => {
        document.getElementById('paymentModeLayout').classList.remove('d-flex');
        document.getElementById('paymentModeLayout').classList.add('d-none');
        document.getElementById('orderModeLayout').classList.remove('d-none');
        document.getElementById('orderModeLayout').classList.add('d-flex');
        typedAmount = "";
    };

    window.numpadType = (val) => {
        if (typedAmount === document.getElementById('ticketTotal').textContent) typedAmount = "";
        typedAmount += val;
        document.getElementById('paymentAmountInput').value = "$" + typedAmount;
    };

    window.numpadClear = () => {
        typedAmount = "";
        document.getElementById('paymentAmountInput').value = "$0.00";
    };

    window.finalizePayment = async (method) => {
        if (method === 'Credit') {
            const cuotas = prompt("Ingrese número de cuotas (Installments):", "1");
            if (!cuotas) return;
        } else if (method === 'GiftCard') {
            const code = prompt("Ingrese el código de la Gift Card:");
            if (!code) return;
        }

        const totalAmount = currentCheck.items.reduce((acc, curr) => acc + curr.total, 0);
        const payload = {
            tableName: currentCheck.tableName,
            checkNumber: currentCheck.checkNumber || currentCheck.checkId,
            items: currentCheck.items,
            totalAmount: totalAmount,
            status: 'Pagada'
        };

        const reqMethod = currentCheck._id ? 'PUT' : 'POST';
        const url = currentCheck._id ? `/api/orders/${currentCheck._id}` : '/api/orders';

        try {
            const res = await fetch(url, {
                method: reqMethod,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert(`Payment Successful via ${method}. Check Closed.`);
                returnToMap();
            }
        } catch (error) { alert('Error processing payment.'); }
    };

    document.getElementById('newProductForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById('prodName').value,
            category: document.getElementById('prodCat').value,
            price: Number(document.getElementById('prodPrice').value)
        };
        await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) });
        document.getElementById('newProductForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('adminModal')).hide();
        initializeApp();
    });

    initializeApp();
});