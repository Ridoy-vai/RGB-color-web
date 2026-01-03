
    
        let colors = [];
        let currentIndex = 0;
        let isGradientMode = false;
        let currentGrad = {c1: "", c2: ""};
        const footer = document.getElementById('dynamicFooter');
        let isScrolling;

        function init() {
            const grid = document.getElementById('colorGrid');
            for(let i=0; i<140000; i++) {
                let c = getRandomHex();
                colors.push(c);
                addBoxToGrid(c, i);
            }
        }

        function getRandomHex() {
            return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
        }

        function addBoxToGrid(c, index) {
            const div = document.createElement('div');
            div.className = 'color-box';
            div.style.backgroundColor = c;
            div.onclick = () => openFS(index);
            document.getElementById('colorGrid').appendChild(div);
        }

        // ফুটার লজিক
        window.addEventListener('scroll', function() {
            let scrollHeight = document.documentElement.scrollHeight;
            let scrollPosition = window.innerHeight + window.pageYOffset;
            
            if (scrollHeight - scrollPosition > 100) {
                footer.classList.add('footer-hidden');
            }
            
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(function() {
                footer.classList.remove('footer-hidden');
                if (scrollHeight - scrollPosition < 80) {
                    footer.style.position = "relative";
                } else {
                    footer.style.position = "fixed";
                }
            }, 100); 
        }, false);

        function openFS(index) {
            isGradientMode = false;
            currentIndex = index;
            updateFSDisplay(colors[currentIndex]);
            document.getElementById('fullScreen').style.display = 'flex';
            footer.style.display = 'none';
        }

        function closeFS() { 
            document.getElementById('fullScreen').style.display = 'none'; 
            footer.style.display = 'block';
        }

        function updateFSDisplay(val, isGrad = false) {
            const display = document.getElementById('fsDisplay');
            const label = document.getElementById('hexLabel');
            display.style.background = val;
            label.innerText = isGrad ? "Gradient Mode" : val;
        }

        function changeColor(step) {
            if(isGradientMode) { generateRandomGradient(); return; }
            currentIndex = (currentIndex + step + colors.length) % colors.length;
            updateFSDisplay(colors[currentIndex]);
        }

        function generateRandomGradient() {
            isGradientMode = true;
            currentGrad.c1 = getRandomHex();
            currentGrad.c2 = getRandomHex();
            const grad = `linear-gradient(45deg, ${currentGrad.c1}, ${currentGrad.c2})`;
            updateFSDisplay(grad, true);
            document.getElementById('fullScreen').style.display = 'flex';
            footer.style.display = 'none';
        }

        function searchColor() {
            let val = document.getElementById('searchBox').value.trim().toUpperCase();
            if(/^#[0-9A-F]{6}$/i.test(val)) {
                if(!colors.includes(val)) {
                    colors.push(val);
                    addBoxToGrid(val, colors.length - 1);
                }
                openFS(colors.indexOf(val));
            } else { showToast("❌ Invalid HEX!", "red"); }
        }

        function toggleMix() {
            const p = document.getElementById('mixPopup');
            p.style.display = (p.style.display === 'block') ? 'none' : 'block';
        }

        function mixColors() {
            const c1 = document.getElementById('color1').value;
            const c2 = document.getElementById('color2').value;
            if(/^#[0-9A-F]{6}$/i.test(c1) && /^#[0-9A-F]{6}$/i.test(c2)) {
                const r = Math.floor((parseInt(c1.slice(1,3), 16) + parseInt(c2.slice(1,3), 16)) / 2);
                const g = Math.floor((parseInt(c1.slice(3,5), 16) + parseInt(c2.slice(3,5), 16)) / 2);
                const b = Math.floor((parseInt(c1.slice(5,7), 16) + parseInt(c2.slice(5,7), 16)) / 2);
                const mixed = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
                const res = document.getElementById('mixResult');
                res.style.background = mixed;
                res.innerText = mixed;
                res.style.color = (r+g+b > 382) ? 'black' : 'white';
                res.dataset.color = mixed;
            }
        }

        function saveMixedColor() {
            const c = document.getElementById('mixResult').dataset.color;
            if(c) {
                colors.push(c);
                addBoxToGrid(c, colors.length - 1);
                showToast("Saved to Grid!");
            }
        }

        function copyCode() {
            const text = isGradientMode ? `background: linear-gradient(45deg, ${currentGrad.c1}, ${currentGrad.c2});` : colors[currentIndex];
            navigator.clipboard.writeText(text);
            showToast("✅ Copied!");
        }

        function showToast(msg, color = "#4CAF50") {
            const t = document.getElementById('toast');
            t.innerText = msg; t.style.background = color; t.style.top = "20px";
            setTimeout(() => t.style.top = "-60px", 2000);
        }

        function handleDownload() {
            const canvas = document.createElement('canvas');
            canvas.width = 1920; canvas.height = 1080;
            const ctx = canvas.getContext('2d');
            if(isGradientMode) {
                const g = ctx.createLinearGradient(0,0,1920,1080);
                g.addColorStop(0, currentGrad.c1); g.addColorStop(1, currentGrad.c2);
                ctx.fillStyle = g;
            } else {
                ctx.fillStyle = colors[currentIndex];
            }
            ctx.fillRect(0,0,1920,1080);
            const link = document.createElement('a');
            link.download = 'ColorZen-Export.png';
            link.href = canvas.toDataURL();
            link.click();
        }

        init();

        // footer auto year

        document.getElementById('currentYear').textContent = new Date().getFullYear();