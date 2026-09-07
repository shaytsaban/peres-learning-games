/* ==========================================================================
   OptionsAcademy Core Simulation Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------------------------
    // 1. STATE & CONSTANTS
    // ----------------------------------------------------------------------
    const STATE = {
        cash: 100000,
        portfolioValue: 100000,
        initialValue: 100000,
        daysSimulated: 0,
        currentAsset: "AAPL",
        assets: {
            AAPL: { name: "Apple Inc.", price: 150.00, history: [], volatility: 0.25, drift: 0.05, news: [
                "Apple announces revolutionary AI sunglasses.",
                "Rumors of supply chain bottlenecks in Asia.",
                "Analysts raise target price for AAPL to $180.",
                "New regulatory scrutiny over App Store fees.",
                "Earnings report beats expectations by 12%."
            ]},
            TSLA: { name: "Tesla Motors", price: 200.00, history: [], volatility: 0.45, drift: 0.10, news: [
                "Tesla launches fully autonomous Robo-Taxi.",
                "New Gigafactory receives approval in Germany.",
                "Concerns grow over EV battery raw material costs.",
                "CEO sells $2B worth of shares; market reacts.",
                "Tesla delivery numbers hit record quarterly high."
            ]},
            SPY: { name: "S&P 500 ETF", price: 410.00, history: [], volatility: 0.15, drift: 0.08, news: [
                "Federal Reserve signals potential interest rate cuts.",
                "Inflation indicators show signs of cooling down.",
                "Retail sales beat forecast, signal consumer strength.",
                "Global energy prices stabilize; markets rally.",
                "Tensions rise in international trade negotiations."
            ]}
        },
        positions: [], // { id, asset, type, strike, qty, cost, currentPrice, daysLeft, optionType, isCovered }
        selectedOptionForPayoff: null, // Holds currently selected option for rendering payoff curve
        selectedTransaction: null, // For modal
        currentMission: 1,
        eli5Mode: false,
        daysToChainExpiration: 15
    };

    // Jargon Glossary database
    const GLOSSARY = [
        {
            term: "Call Option",
            definition: "An agreement giving you the right (but not obligation) to BUY a stock at a set price. Buy this if you think the stock will rise.",
            eli5: "A ticket that locks in a low price for a popular item. If the item's price goes super high, you still get to buy it cheap!"
        },
        {
            term: "Put Option",
            definition: "An agreement giving you the right (but not obligation) to SELL a stock at a set price. Buy this if you think the stock will fall.",
            eli5: "An insurance policy. If your stock crashes, the put option guarantees someone will buy it from you at the higher locked-in price."
        },
        {
            term: "Strike Price",
            definition: "The pre-agreed price at which the stock will be bought or sold if the option is exercised.",
            eli5: "The locked-in price written on your discount coupon."
        },
        {
            term: "Premium",
            definition: "The price you pay to purchase an option contract. This goes to the seller of the contract.",
            eli5: "The non-refundable fee you pay to buy a coupon or insurance policy."
        },
        {
            term: "Expiration Date",
            definition: "The final day the option contract is valid. After this, it either pays out or becomes completely worthless.",
            eli5: "The expiration date printed on a discount coupon. Use it or lose it!"
        },
        {
            term: "In The Money (ITM)",
            definition: "When an option has active intrinsic value. For a Call, stock price is above strike. For a Put, stock price is below strike.",
            eli5: "Your coupon actually saves you money right now! (Example: Lock price is $150, but stock is selling for $160)."
        },
        {
            term: "Out of The Money (OTM)",
            definition: "When an option has no intrinsic value. It is made up entirely of 'time value'. If it expires OTM, it is worth $0.",
            eli5: "Your coupon is useless today. (Example: Lock price is $150, but anyone can buy the stock on the street for $140)."
        },
        {
            term: "Theta (Time Decay)",
            definition: "The rate at which an option's premium loses value as expiration approaches. Decay accelerates in the final days.",
            eli5: "A melting ice cube. The closer you get to expiration, the faster the option value melts away if the stock doesn't move!"
        },
        {
            term: "Covered Call",
            definition: "An income strategy where you own the underlying stock and sell a Call option to collect premium cash.",
            eli5: "Renting out your spare room. You collect rental income (premium) while holding onto your property (stock)."
        }
    ];

    // Guided learning missions checklist
    const MISSIONS = {
        1: {
            title: "Buy Your First Call Option",
            desc: "Bet that Apple (AAPL) stock will rise and buy a Call Option contract.",
            check: () => STATE.positions.some(p => p.asset === "AAPL" && p.optionType === "CALL" && p.qty > 0),
            successTip: "Fantastic! You bought a Call option. Now try clicking '+1 Day' a few times to see how the price fluctuates or let it reach expiration!",
            optiTip: "We are bullish on Apple! Let's select AAPL, look at the Call options on the Option Chain, and buy a strike around $150 or $155. Remember: you pay a small premium to lock in a purchase price."
        },
        2: {
            title: "Protect with a Put Option",
            desc: "Protect against a Tesla stock drop by buying a Put Option contract.",
            check: () => STATE.positions.some(p => p.asset === "TSLA" && p.optionType === "PUT" && p.qty > 0),
            successTip: "Superb! You now have protection. If Tesla stock falls, the value of your Put will skyrocket, shielding your cash!",
            optiTip: "Tesla (TSLA) has higher volatility (swings). Let's protect against potential drops. Find TSLA in the asset selector, go to the Puts side of the option chain, and buy a contract!"
        },
        3: {
            title: "Income with Covered Calls",
            desc: "Generate premium income by writing (selling) a Call option against stock you own.",
            check: () => {
                return STATE.positions.some(p => p.optionType === "CALL" && p.qty < 0);
            },
            successTip: "Amazing! You sold a Call option and immediately collected premium cash. This is how professional funds generate consistent income.",
            optiTip: "Covered calls are an investor favorite! Select any asset (AAPL, TSLA, or SPY). Go to the Calls side of the Option Chain, and click any 'Bid (Sell)' button to write (sell) a Call contract and collect instant cash premium!"
        },
        4: {
            title: "The Bull Call Spread",
            desc: "Reduce premium cost by combining a bought call with a sold call.",
            check: () => {
                const calls = STATE.positions.filter(p => p.optionType === "CALL");
                return calls.some(c => c.qty > 0) && calls.some(c => c.qty < 0);
            },
            successTip: "Brilliant! You created a Spread! By selling a higher strike Call, you subsidized the cost of the Call you bought. Your potential risk and reward are now beautifully capped.",
            optiTip: "Spreads are advanced but friendly! Buy a Call at a lower strike, then Sell a Call at a higher strike on the same asset. This limits your maximum profit, but makes the trade much cheaper to enter!"
        }
    };

    // ----------------------------------------------------------------------
    // 2. DOM ELEMENTS
    // ----------------------------------------------------------------------
    const cashEl = document.getElementById("cash-balance");
    const portfolioEl = document.getElementById("portfolio-value");
    const returnEl = document.getElementById("total-return");
    const assetSelect = document.getElementById("asset-select");
    const currentPriceEl = document.getElementById("current-asset-price");
    const chartTitleEl = document.getElementById("chart-title");
    const newsTextEl = document.getElementById("news-text");
    const optionChainRows = document.getElementById("option-chain-rows");
    const portfolioRows = document.getElementById("portfolio-rows");
    const positionsCountEl = document.getElementById("positions-count");
    
    // Buttons
    const btnFastForward = document.getElementById("btn-fast-forward");
    const btnReset = document.getElementById("btn-reset");
    const btnEli5Toggle = document.getElementById("btn-eli5-toggle");
    const toggleItm = document.getElementById("toggle-itm-highlights");

    // Modal elements
    const tradeModal = document.getElementById("trade-modal");
    const modalTitle = document.getElementById("modal-trade-title");
    const modalOptiTip = document.getElementById("modal-tip-text");
    const modalPremiumPrice = document.getElementById("modal-premium-price");
    const modalTotalCost = document.getElementById("modal-total-cost");
    const tradeQtyInput = document.getElementById("trade-qty");
    const btnQtyMinus = document.getElementById("qty-minus");
    const btnQtyPlus = document.getElementById("qty-plus");
    const btnModalCancel = document.getElementById("btn-modal-cancel");
    const btnModalConfirm = document.getElementById("btn-modal-confirm");
    const btnCloseModal = document.getElementById("btn-close-modal");

    // Glossary elements
    const glossaryFloater = document.getElementById("glossary-floater");
    const btnGlossaryToggle = document.getElementById("btn-glossary-toggle");
    const glossarySearchInput = document.getElementById("glossary-search");
    const glossaryListItems = document.getElementById("glossary-list-items");

    // Opti speech
    const optiSpeechEl = document.getElementById("opti-speech");

    // ----------------------------------------------------------------------
    // 3. CHART SETUP (CHART.JS & CUSTOM CANVAS)
    // ----------------------------------------------------------------------
    let stockChart = null;

    function initStockChart() {
        const ctx = document.getElementById("stockChart").getContext("2d");
        
        // Initialize 10 historical points
        Object.keys(STATE.assets).forEach(key => {
            const asset = STATE.assets[key];
            for (let i = 0; i < 15; i++) {
                const dayFactor = i - 14;
                // Generate simple backward brownian path
                const rand = (Math.random() - 0.48) * asset.volatility * 3;
                asset.history.push({
                    day: dayFactor,
                    price: Math.max(10, asset.price * (1 + rand))
                });
            }
        });

        const activeAsset = STATE.assets[STATE.currentAsset];
        const labels = activeAsset.history.map(h => `Day ${h.day}`);
        const data = activeAsset.history.map(h => h.price);

        stockChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${STATE.currentAsset} Price`,
                    data: data,
                    borderColor: '#6366f1',
                    borderWidth: 3,
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#9ca3af' }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: {
                            color: '#9ca3af',
                            callback: (value) => `$${value.toFixed(2)}`
                        }
                    }
                }
            }
        });
    }

    // Custom payoff diagram drawer (Vanilla HTML5 Canvas)
    function drawPayoffDiagram() {
        const canvas = document.getElementById("payoffChart");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);

        // Light mode styled Grid lines
        ctx.strokeStyle = "rgba(15, 23, 42, 0.05)";
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
        for (let i = 0; i < height; i += 40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }

        // Draw horizontal zero P&L line
        const zeroY = height / 2;
        ctx.strokeStyle = "rgba(15, 23, 42, 0.2)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, zeroY);
        ctx.lineTo(width, zeroY);
        ctx.stroke();

        const currentPrice = STATE.assets[STATE.currentAsset].price;
        const activeAssetPositions = STATE.positions.filter(p => p.asset === STATE.currentAsset);

        // Get all strike prices involved
        let strikesToConsider = [];
        if (activeAssetPositions.length > 0) {
            activeAssetPositions.forEach(p => strikesToConsider.push(p.strike));
        } else if (STATE.selectedOptionForPayoff) {
            strikesToConsider.push(STATE.selectedOptionForPayoff.strike);
        }

        if (strikesToConsider.length === 0) {
            ctx.fillStyle = "rgba(15, 23, 42, 0.4)";
            ctx.font = "12px Inter";
            ctx.textAlign = "center";
            ctx.fillText("Select a contract from the chain to view potential payoff!", width / 2, height / 2 - 10);
            return;
        }

        const minStrike = Math.min(...strikesToConsider);
        const maxStrike = Math.max(...strikesToConsider);
        const minX = minStrike * 0.75;
        const maxX = maxStrike * 1.25;
        const rangeX = maxX - minX;

        function getXPixel(price) {
            return ((price - minX) / (rangeX || 1)) * width;
        }

        // Calculate combined net profit and loss
        function getPL(price) {
            let totalPL = 0;
            if (activeAssetPositions.length > 0) {
                activeAssetPositions.forEach(p => {
                    const isCall = p.optionType === "CALL";
                    let optionPL = 0;
                    if (isCall) {
                        optionPL = Math.max(0, price - p.strike) - p.cost;
                    } else {
                        optionPL = Math.max(0, p.strike - price) - p.cost;
                    }
                    totalPL += optionPL * 100 * p.qty;
                });
            } else if (STATE.selectedOptionForPayoff) {
                const opt = STATE.selectedOptionForPayoff;
                const isCall = opt.optionType === "CALL";
                const isBuy = opt.actionType === "BUY";
                let optionPL = 0;
                if (isCall) {
                    optionPL = Math.max(0, price - opt.strike) - opt.premium;
                } else {
                    optionPL = Math.max(0, opt.strike - price) - opt.premium;
                }
                totalPL = (isBuy ? optionPL : -optionPL) * 100;
            }
            return totalPL;
        }

        // Auto-scale Y based on sampled points
        const samplePoints = [minX, minX + rangeX*0.2, minX + rangeX*0.4, minX + rangeX*0.6, minX + rangeX*0.8, maxX];
        const plVals = samplePoints.map(p => Math.abs(getPL(p)));
        const maxVisualPL = Math.max(...plVals, 150); // Minimum scale size of $150

        function getYPixel(plValue) {
            const relativePL = plValue / maxVisualPL;
            return zeroY - (relativePL * (height / 2.6));
        }

        // Compute points
        const points = [];
        const numPoints = 120;
        for (let i = 0; i <= numPoints; i++) {
            const price = minX + (rangeX * (i / numPoints));
            const pl = getPL(price);
            points.push({ x: getXPixel(price), y: getYPixel(pl), price, pl });
        }

        // Shading zones
        // Green profit zone
        ctx.fillStyle = "rgba(5, 150, 105, 0.08)";
        ctx.beginPath();
        ctx.moveTo(0, zeroY);
        points.forEach(p => {
            if (p.pl > 0) ctx.lineTo(p.x, p.y);
        });
        ctx.lineTo(points[points.length - 1].x, zeroY);
        ctx.closePath();
        ctx.fill();

        // Red loss zone
        ctx.fillStyle = "rgba(225, 29, 72, 0.08)";
        ctx.beginPath();
        ctx.moveTo(0, zeroY);
        points.forEach(p => {
            if (p.pl < 0) ctx.lineTo(p.x, p.y);
        });
        ctx.lineTo(points[points.length - 1].x, zeroY);
        ctx.closePath();
        ctx.fill();

        // Draw Payoff Curve line
        ctx.strokeStyle = activeAssetPositions.length > 0 ? "var(--color-primary)" : (STATE.selectedOptionForPayoff.optionType === "CALL" ? "var(--color-call)" : "var(--color-put)");
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        // Draw Strikes vertical indicator lines
        strikesToConsider.forEach(strike => {
            const strikeX = getXPixel(strike);
            ctx.strokeStyle = "var(--color-primary)";
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(strikeX, 0);
            ctx.lineTo(strikeX, height);
            ctx.stroke();
            ctx.setLineDash([]);
            
            ctx.fillStyle = "var(--color-primary)";
            ctx.font = "bold 9px Outfit";
            ctx.textAlign = "center";
            ctx.fillText(`Strike ($${strike})`, strikeX, 15);
        });

        // Draw Current Price vertical line
        const currX = getXPixel(currentPrice);
        if (currX >= 0 && currX <= width) {
            ctx.strokeStyle = "rgba(15, 23, 42, 0.4)";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(currX, 0);
            ctx.lineTo(currX, height);
            ctx.stroke();

            // Label current price dot
            const currPL = getPL(currentPrice);
            const currY = getYPixel(currPL);
            
            ctx.fillStyle = "var(--text-primary)";
            ctx.beginPath();
            ctx.arc(currX, currY, 6, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = "white";
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            ctx.font = "bold 10px Inter";
            ctx.textAlign = "left";
            ctx.fillStyle = "var(--text-primary)";
            ctx.fillText(` Now ($${currentPrice.toFixed(2)})`, currX + 8, currY - 6);
        }

        // Calculate dynamic labels
        let minPLVal = 0;
        let maxPLVal = 0;
        let breakevens = [];
        let prevVal = getPL(minX);
        let sampleStep = rangeX / 120;
        
        for (let i = 0; i <= 120; i++) {
            const p = minX + i * sampleStep;
            const pl = getPL(p);
            if (pl < minPLVal) minPLVal = pl;
            if (pl > maxPLVal) maxPLVal = pl;
            
            if (i > 0) {
                if ((prevVal < 0 && pl >= 0) || (prevVal > 0 && pl <= 0)) {
                    breakevens.push(p);
                }
            }
            prevVal = pl;
        }

        const maxLossLabel = minPLVal < -0.01 ? `-$${Math.abs(minPLVal).toFixed(2)}` : "$0.00";
        const maxProfitLabel = maxPLVal > 200000 ? "Unlimited" : (maxPLVal > 0.01 ? `$${maxPLVal.toFixed(2)}` : "$0.00");
        const breakevenLabel = breakevens.length > 0 ? breakevens.map(b => `$${b.toFixed(2)}`).join(", ") : "None";

        document.getElementById("payoff-max-profit").textContent = maxProfitLabel;
        document.getElementById("payoff-max-loss").textContent = maxLossLabel;
        document.getElementById("payoff-breakeven").textContent = breakevenLabel;
    }

    // ----------------------------------------------------------------------
    // 4. GENERATING OPTION CHAINS (Black-Scholes dynamic heuristic)
    // ----------------------------------------------------------------------
    function generateOptionChain() {
        const activeAsset = STATE.assets[STATE.currentAsset];
        const spot = activeAsset.price;
        optionChainRows.innerHTML = "";

        // Standard strikes around spot
        const interval = spot > 300 ? 10 : (spot > 100 ? 5 : 2);
        const centerStrike = Math.round(spot / interval) * interval;
        const strikes = [];
        
        for (let i = -3; i <= 3; i++) {
            strikes.push(centerStrike + (i * interval));
        }

        strikes.forEach(strike => {
            // Simplified pricing model
            const diff = strike - spot;
            const volFactor = activeAsset.volatility;
            const timeFactor = Math.sqrt(STATE.daysToChainExpiration / 365);
            
            // Heuristic Option Premiums
            let callPremium = Math.max(0.1, (spot - strike) + (spot * volFactor * timeFactor * 0.4));
            let putPremium = Math.max(0.1, (strike - spot) + (spot * volFactor * timeFactor * 0.4));
            
            // Limit minimum premiums
            callPremium = Math.round(callPremium * 100) / 100;
            putPremium = Math.round(putPremium * 100) / 100;

            const callBid = Math.round(callPremium * 0.95 * 100) / 100;
            const callAsk = callPremium;
            const putBid = Math.round(putPremium * 0.95 * 100) / 100;
            const putAsk = putPremium;

            // ITM calculations
            const isCallItm = spot > strike;
            const isPutItm = spot < strike;
            
            const highlightItm = toggleItm.checked;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <!-- CALLS -->
                <td class="${highlightItm && isCallItm ? 'cell-itm-call' : ''}">
                    <button class="chain-btn call-sell" data-strike="${strike}" data-premium="${callBid}" data-type="CALL" data-action="SELL">$${callBid.toFixed(2)}</button>
                </td>
                <td class="${highlightItm && isCallItm ? 'cell-itm-call' : ''}">
                    <button class="chain-btn call-buy" data-strike="${strike}" data-premium="${callAsk}" data-type="CALL" data-action="BUY">$${callAsk.toFixed(2)}</button>
                </td>
                <td class="${highlightItm && isCallItm ? 'cell-itm-call' : ''}">
                    <span class="itm-badge ${isCallItm ? 'itm-call' : 'otm'}">${isCallItm ? 'ITM' : 'OTM'}</span>
                </td>
                
                <!-- STRIKE -->
                <td class="strike-col">$${strike.toFixed(2)}</td>
                
                <!-- PUTS -->
                <td class="${highlightItm && isPutItm ? 'cell-itm-put' : ''}">
                    <span class="itm-badge ${isPutItm ? 'itm-put' : 'otm'}">${isPutItm ? 'ITM' : 'OTM'}</span>
                </td>
                <td class="${highlightItm && isPutItm ? 'cell-itm-put' : ''}">
                    <button class="chain-btn put-sell" data-strike="${strike}" data-premium="${putBid}" data-type="PUT" data-action="SELL">$${putBid.toFixed(2)}</button>
                </td>
                <td class="${highlightItm && isPutItm ? 'cell-itm-put' : ''}">
                    <button class="chain-btn put-buy" data-strike="${strike}" data-premium="${putAsk}" data-type="PUT" data-action="BUY">$${putAsk.toFixed(2)}</button>
                </td>
            `;
            optionChainRows.appendChild(tr);
        });

        // Attach event listeners to option chain buttons
        document.querySelectorAll(".chain-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const dataset = e.currentTarget.dataset;
                const strike = parseFloat(dataset.strike);
                const premium = parseFloat(dataset.premium);
                const optionType = dataset.type;
                const actionType = dataset.action;

                STATE.selectedOptionForPayoff = { strike, premium, optionType, actionType };
                drawPayoffDiagram();

                // Open trade modal
                openTradeModal(actionType, optionType, strike, premium);
            });
        });
    }

    // ----------------------------------------------------------------------
    // 5. TRANSACTION MODAL HANDLERS
    // ----------------------------------------------------------------------
    function openTradeModal(action, type, strike, premium) {
        STATE.selectedTransaction = { action, type, strike, premium };
        
        modalTitle.textContent = `${action === "BUY" ? "Buy" : "Sell (Write)"} ${type} - ${STATE.currentAsset} $${strike.toFixed(2)} Strike`;
        modalPremiumPrice.textContent = `$${premium.toFixed(2)}`;
        
        let multiplier = action === "BUY" ? 1 : -1;
        let totalCost = premium * 100 * parseInt(tradeQtyInput.value);
        modalTotalCost.textContent = `$${totalCost.toFixed(2)}`;
        modalTotalCost.className = action === "BUY" ? (type === "CALL" ? "text-call" : "text-put") : "text-neutral";

        // Owl advice translations
        let tip = "";
        if (action === "BUY") {
            if (type === "CALL") {
                tip = `Buying a call gives you the right to BUY 100 shares of Apple at $${strike.toFixed(2)}. This is a bullish bet! You profit if the stock rises above $${(strike + premium).toFixed(2)} by expiration.`;
            } else {
                tip = `Buying a put gives you the right to SELL 100 shares at $${strike.toFixed(2)}. This is a bearish bet! You profit if the stock drops below $${(strike - premium).toFixed(2)} by expiration.`;
            }
        } else {
            tip = `Selling (writing) a contract gives you instant cash ($${(premium * 100).toFixed(2)} per contract), but you assume the risk if the option goes in-the-money! Excellent for generating income.`;
        }

        if (STATE.eli5Mode) {
            if (action === "BUY") {
                tip = `🦉 ELI5: You are paying a small entry fee ($${(premium * 100).toFixed(2)}) to lock in the price of the stock. If the stock swings favorable, your profit can be huge! If not, the maximum you lose is your entry fee.`;
            } else {
                tip = `🦉 ELI5: You are acting as the insurance company. You pocket the premium cash today, but if things go bad for the buyer, you have to pay up!`;
            }
        }

        modalOptiTip.textContent = tip;
        tradeModal.classList.remove("hidden");
    }

    function updateModalTotal() {
        if (!STATE.selectedTransaction) return;
        const qty = parseInt(tradeQtyInput.value) || 1;
        const totalCost = STATE.selectedTransaction.premium * 100 * qty;
        modalTotalCost.textContent = `$${totalCost.toFixed(2)}`;
    }

    btnQtyMinus.addEventListener("click", () => {
        let val = parseInt(tradeQtyInput.value) || 1;
        if (val > 1) {
            tradeQtyInput.value = val - 1;
            updateModalTotal();
        }
    });

    btnQtyPlus.addEventListener("click", () => {
        let val = parseInt(tradeQtyInput.value) || 1;
        tradeQtyInput.value = val + 1;
        updateModalTotal();
    });

    tradeQtyInput.addEventListener("input", updateModalTotal);

    btnModalCancel.addEventListener("click", () => {
        tradeModal.classList.add("hidden");
    });
    btnCloseModal.addEventListener("click", () => {
        tradeModal.classList.add("hidden");
    });

    btnModalConfirm.addEventListener("click", () => {
        if (!STATE.selectedTransaction) return;
        const tx = STATE.selectedTransaction;
        const qty = parseInt(tradeQtyInput.value) || 1;
        const totalPremium = tx.premium * 100 * qty;

        if (tx.action === "BUY" && totalPremium > STATE.cash) {
            alert("Not enough cash to buy this contract!");
            return;
        }

        // Add position
        const pos = {
            id: Date.now().toString(),
            asset: STATE.currentAsset,
            optionType: tx.type,
            strike: tx.strike,
            qty: tx.action === "BUY" ? qty : -qty,
            cost: tx.premium,
            currentPrice: tx.premium,
            daysLeft: STATE.daysToChainExpiration,
            isCovered: false
        };

        if (tx.action === "BUY") {
            STATE.cash -= totalPremium;
        } else {
            STATE.cash += totalPremium;
        }

        STATE.positions.push(pos);
        tradeModal.classList.add("hidden");
        
        // Refresh UI
        updatePortfolio();
        generateOptionChain();
        checkMissions();
    });

    // ----------------------------------------------------------------------
    // 6. PORTFOLIO & WALLET LOGIC
    // ----------------------------------------------------------------------
    function updatePortfolio() {
        const spot = STATE.assets[STATE.currentAsset].price;
        
        // Update positions current option valuation based on simple spot drift
        let totalOptionValue = 0;
        STATE.positions.forEach(p => {
            const assetSpot = STATE.assets[p.asset].price;
            const diff = p.strike - assetSpot;
            const timeFactor = Math.sqrt(p.daysLeft / 365);
            
            let premiumValue = 0;
            if (p.optionType === "CALL") {
                premiumValue = Math.max(0.05, (assetSpot - p.strike) + (assetSpot * 0.25 * timeFactor * 0.4));
            } else {
                premiumValue = Math.max(0.05, (p.strike - assetSpot) + (assetSpot * 0.25 * timeFactor * 0.4));
            }
            
            p.currentPrice = Math.round(premiumValue * 100) / 100;
            totalOptionValue += p.currentPrice * 100 * p.qty;
        });

        // Set portfolio totals
        STATE.portfolioValue = STATE.cash + totalOptionValue;
        const totalReturn = STATE.portfolioValue - STATE.initialValue;
        const returnPct = (totalReturn / STATE.initialValue) * 100;

        cashEl.textContent = `$${STATE.cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        portfolioEl.textContent = `$${STATE.portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        if (totalReturn > 0) {
            returnEl.textContent = `+$${totalReturn.toFixed(2)} (+${returnPct.toFixed(2)}%)`;
            returnEl.className = "stat-value text-call";
        } else if (totalReturn < 0) {
            returnEl.textContent = `-$${Math.abs(totalReturn).toFixed(2)} (${returnPct.toFixed(2)}%)`;
            returnEl.className = "stat-value text-put";
        } else {
            returnEl.textContent = `$0.00 (0.00%)`;
            returnEl.className = "stat-value text-neutral";
        }

        // Render Positions Table
        positionsCountEl.textContent = `${STATE.positions.length} Position(s)`;
        portfolioRows.innerHTML = "";

        if (STATE.positions.length === 0) {
            portfolioRows.innerHTML = `
                <tr>
                    <td colspan="9" class="empty-portfolio-msg">
                        <i data-lucide="inbox"></i>
                        <p>No open positions. Use the Option Chain above to purchase your first contract!</p>
                    </td>
                </tr>
            `;
            lucide.createIcons();
            return;
        }

        STATE.positions.forEach(p => {
            const tr = document.createElement("tr");
            const side = p.qty > 0 ? "LONG" : "SHORT";
            const colorClass = p.optionType === "CALL" ? "text-call" : "text-put";
            const currentVal = p.currentPrice * 100 * p.qty;
            const costVal = p.cost * 100 * p.qty;
            const pnl = currentVal - costVal;

            tr.innerHTML = `
                <td><strong>${p.asset}</strong></td>
                <td class="${colorClass}">${side} ${p.optionType}</td>
                <td>$${p.strike.toFixed(2)}</td>
                <td>${Math.abs(p.qty)}</td>
                <td>$${p.cost.toFixed(2)}</td>
                <td>$${currentVal.toFixed(2)}</td>
                <td>${p.daysLeft}d</td>
                <td class="${pnl >= 0 ? 'text-call' : 'text-put'}">${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}</td>
                <td>
                    <button class="btn btn-secondary btn-sm btn-close-position" data-id="${p.id}">Close</button>
                </td>
            `;
            portfolioRows.appendChild(tr);
        });

        // Close position listeners
        document.querySelectorAll(".btn-close-position").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                closePosition(id);
            });
        });
    }

    function closePosition(id) {
        const index = STATE.positions.findIndex(p => p.id === id);
        if (index === -1) return;
        const pos = STATE.positions[index];
        const sellValue = pos.currentPrice * 100 * pos.qty;

        STATE.cash += sellValue; // Selling back to close adds/subtracts appropriately based on qty polarity
        STATE.positions.splice(index, 1);
        updatePortfolio();
        generateOptionChain();
    }

    // ----------------------------------------------------------------------
    // 7. GAME TICKER & TIME ACCELERATION (Fast Forward)
    // ----------------------------------------------------------------------
    function simulateMarketTick() {
        // Simple random walk for prices
        Object.keys(STATE.assets).forEach(key => {
            const asset = STATE.assets[key];
            const rand = (Math.random() - 0.49) * asset.volatility * 0.15;
            asset.price = Math.max(5, asset.price * (1 + rand));
            
            // Add point to history
            asset.history.push({
                day: STATE.daysSimulated,
                price: asset.price
            });
            if (asset.history.length > 20) {
                asset.history.shift();
            }
        });

        // Update displays
        const activeAsset = STATE.assets[STATE.currentAsset];
        currentPriceEl.textContent = `$${activeAsset.price.toFixed(2)}`;
        
        // Update asset selection dropdown option text to show live price
        const optA = assetSelect.querySelector("option[value='AAPL']");
        const optT = assetSelect.querySelector("option[value='TSLA']");
        const optS = assetSelect.querySelector("option[value='SPY']");
        optA.textContent = `🍏 Apple Inc. (AAPL) — $${STATE.assets.AAPL.price.toFixed(2)}`;
        optT.textContent = `⚡ Tesla Motors (TSLA) — $${STATE.assets.TSLA.price.toFixed(2)}`;
        optS.textContent = `🏛️ S&P 500 Index (SPY) — $${STATE.assets.SPY.price.toFixed(2)}`;

        // Redraw chart
        if (stockChart) {
            stockChart.data.labels = activeAsset.history.map(h => `Day ${h.day}`);
            stockChart.data.datasets[0].data = activeAsset.history.map(h => h.price);
            stockChart.data.datasets[0].label = `${STATE.currentAsset} Price`;
            stockChart.update();
        }

        // Draw payoff to reflect new live spot
        drawPayoffDiagram();
        generateOptionChain();
        updatePortfolio();
    }

    // Every 5 seconds simulate simple minor market movement
    setInterval(simulateMarketTick, 5000);

    // TIME LAPSE (+1 Day)
    btnFastForward.addEventListener("click", () => {
        STATE.daysSimulated += 1;
        
        // Decay options time left
        STATE.positions.forEach(p => {
            p.daysLeft -= 1;
        });

        // Expire contracts reaching 0 days
        let expMessages = [];
        const activePositions = [];

        STATE.positions.forEach(p => {
            if (p.daysLeft <= 0) {
                // Exercise settlement calculation
                const spot = STATE.assets[p.asset].price;
                let payout = 0;
                
                if (p.optionType === "CALL") {
                    payout = Math.max(0, spot - p.strike) * 100 * p.qty;
                } else {
                    payout = Math.max(0, p.strike - spot) * 100 * p.qty;
                }

                STATE.cash += payout;
                
                const isITM = p.optionType === "CALL" ? spot > p.strike : spot < p.strike;
                if (isITM) {
                    expMessages.push(`🎉 Your ${p.asset} $${p.strike} Call expired IN THE MONEY. Collected $${payout.toFixed(2)} cash!`);
                } else {
                    expMessages.push(`💨 Your ${p.asset} $${p.strike} Put expired out of the money (worthless).`);
                }
            } else {
                activePositions.push(p);
            }
        });

        STATE.positions = activePositions;

        if (expMessages.length > 0) {
            alert(expMessages.join("\n"));
        }

        // Also trigger simulated price jumps for each day skipped
        Object.keys(STATE.assets).forEach(key => {
            const asset = STATE.assets[key];
            const rand = (Math.random() - 0.45) * asset.volatility * 0.4;
            asset.price = Math.max(10, asset.price * (1 + rand));
            
            // Randomly trigger fresh news headline
            if (Math.random() > 0.6) {
                const headlines = asset.news;
                newsTextEl.textContent = headlines[Math.floor(Math.random() * headlines.length)];
            }
        });

        simulateMarketTick();
        checkMissions();
    });

    // ----------------------------------------------------------------------
    // 8. MISSIONS GUIDE & TUTORIALS
    // ----------------------------------------------------------------------
    function checkMissions() {
        const mission = MISSIONS[STATE.currentMission];
        if (!mission) return;

        if (mission.check()) {
            optiSpeechEl.innerHTML = `🌟 <strong>Mission ${STATE.currentMission} Complete!</strong> ${mission.successTip}`;
            
            // Unlock next mission
            const currentItem = document.querySelector(`.mission-item[data-mission='${STATE.currentMission}']`);
            if (currentItem) {
                currentItem.classList.remove("active");
                const statusEl = currentItem.querySelector(".mission-status");
                if (statusEl) statusEl.innerHTML = `<i data-lucide="check-circle" class="text-call"></i>`;
                const progressEl = currentItem.querySelector(".progress");
                if (progressEl) progressEl.style.width = "100%";
            }
            lucide.createIcons();

            STATE.currentMission += 1;
            const nextItem = document.querySelector(`.mission-item[data-mission='${STATE.currentMission}']`);
            
            if (nextItem) {
                nextItem.classList.remove("locked");
                nextItem.classList.add("active");
                nextItem.querySelector(".mission-status").innerHTML = `<i data-lucide="circle-dot"></i>`;
                
                // Introduce next mission
                setTimeout(() => {
                    const nextMission = MISSIONS[STATE.currentMission];
                    optiSpeechEl.innerHTML = `🦉 <strong>Next Goal: Mission ${STATE.currentMission}</strong> - ${nextMission.optiTip}`;
                }, 3000);
            } else {
                optiSpeechEl.innerHTML = `👑 <strong>Outstanding!</strong> You have completed all learning modules! You are now ready to trade options like a true market professional.`;
            }
        }
    }

    // ELI5 translation toggle
    btnEli5Toggle.addEventListener("click", () => {
        STATE.eli5Mode = !STATE.eli5Mode;
        btnEli5Toggle.classList.toggle("active");
        
        if (STATE.eli5Mode) {
            btnEli5Toggle.innerHTML = `<i data-lucide="sparkles"></i> Normal Explanations`;
            optiSpeechEl.textContent = "🙋‍♂️ Understood! Coach Davidi will now translate all options terminology into terms a 5-year old can understand! No more scary Wall Street jargon.";
        } else {
            btnEli5Toggle.innerHTML = `<i data-lucide="sparkles"></i> Translate to Plain English (ELI5)`;
            optiSpeechEl.textContent = "🙋‍♂️ Back to standard financial terminology. Let's conquer the options chain together!";
        }
        lucide.createIcons();
    });

    // ----------------------------------------------------------------------
    // 9. JARGON GLOSSARY HANDLERS
    // ----------------------------------------------------------------------
    function initGlossary() {
        glossaryListItems.innerHTML = "";
        
        GLOSSARY.forEach(item => {
            const div = document.createElement("div");
            div.className = "glossary-item";
            div.innerHTML = `
                <h4>${item.term}</h4>
                <p class="glossary-def">${item.definition}</p>
                <p class="glossary-eli5 hidden">👶 <em>ELI5:</em> ${item.eli5}</p>
            `;
            glossaryListItems.appendChild(div);
        });
    }

    btnGlossaryToggle.addEventListener("click", () => {
        glossaryFloater.classList.toggle("collapsed");
    });

    glossarySearchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const items = glossaryListItems.querySelectorAll(".glossary-item");
        
        items.forEach(item => {
            const title = item.querySelector("h4").textContent.toLowerCase();
            if (title.includes(query)) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    });

    // Reset button
    btnReset.addEventListener("click", () => {
        if (confirm("Are you sure you want to reset your simulation progress?")) {
            STATE.cash = 10000;
            STATE.portfolioValue = 10000;
            STATE.initialValue = 10000;
            STATE.positions = [];
            STATE.currentMission = 1;
            STATE.daysSimulated = 0;
            STATE.selectedOptionForPayoff = null;
            
            // Reload all
            location.reload();
        }
    });

    // Asset selection change
    assetSelect.addEventListener("change", (e) => {
        STATE.currentAsset = e.target.value;
        chartTitleEl.textContent = `${STATE.currentAsset} Price History`;
        
        simulateMarketTick();
        generateOptionChain();
        drawPayoffDiagram();
    });

    toggleItm.addEventListener("change", generateOptionChain);

    // ----------------------------------------------------------------------
    // 10. INITIALIZATION
    // ----------------------------------------------------------------------
    initStockChart();
    generateOptionChain();
    updatePortfolio();
    initGlossary();
    
    // Set initial Coach Davidi advice
    optiSpeechEl.innerHTML = `🙋‍♂️ <strong>Mission 1 Setup</strong>: ${MISSIONS[1].optiTip}`;
    
    // Initialize icons
    lucide.createIcons();
});
