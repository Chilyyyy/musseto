


const getUsers = () => JSON.parse(localStorage.getItem('registered_users')) || [];
const setUsers = (users) => localStorage.setItem('registered_users', JSON.stringify(users));


const sendEmailSimulation = (username, action) => {
    const connectionTime = new Date().toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' });
    
    const simulatedLocation = "Dirección IP (Simulada): 192.168.1.1, [Ubicación aproximada]";
    
    let subject, actionText;
    
    if (action === 'register') {
        subject = '🎉 ¡Bienvenido! Tu cuenta ha sido creada';
        actionText = 'Registro de cuenta';
    } else if (action === 'login') {
        subject = '🔔 Alerta de Inicio de Sesión';
        actionText = 'Inicio de sesión';
    }

   
    console.log(`\n======================================================`);
    console.log(`🚀 SIMULACIÓN DE EMAIL ENVIADO a: ${username}`);
    console.log(`ASUNTO: ${subject}`);
    console.log(`------------------------------------------------------`);
    console.log(`Detalle del Evento: ${actionText}`);
    console.log(`Lugar (Simulado): ${simulatedLocation}`);
    console.log(`Hora en conectarse: ${connectionTime}`);
    console.log(`======================================================\n`);
};



function checkAuthAndRedirect() {
    const currentUser = localStorage.getItem('currentUser'); 
    const isLoginPage = document.body.classList.contains('login-body');

    if (currentUser && isLoginPage) {
      
        window.location.href = 'main.html';
    } else if (!currentUser && !isLoginPage) {
       
        window.location.href = 'index.html';
    }
}
// 
checkAuthAndRedirect();



if (document.body.classList.contains('login-body')) {
    const authForm = document.getElementById('auth-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');
    const switchLink = document.getElementById('switch-to-login');
    const messageDiv = document.getElementById('message');

    const displayMessage = (msg, type) => {
        messageDiv.textContent = msg;
        messageDiv.className = `message ${type}`;
    };

    let isRegistering = true; 

    
    switchLink.addEventListener('click', (e) => {
        e.preventDefault();
        isRegistering = !isRegistering;
        if (isRegistering) {
            formTitle.textContent = 'Registrarse';
            submitBtn.textContent = 'Crear Cuenta';
            switchLink.textContent = 'Iniciar Sesión aquí';
        } else {
            formTitle.textContent = 'Iniciar Sesión';
            submitBtn.textContent = 'Ingresar';
            switchLink.textContent = 'Regístrate aquí';
        }
        displayMessage('', ''); 
        usernameInput.value = '';
        passwordInput.value = '';
    });


    
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        let users = getUsers();

        if (isRegistering) {
            // REGISTRO
            if (users.find(u => u.username === username)) {
                displayMessage(' El usuario ya está registrado inicia sesión.');
                return;
            }
            users.push({ username, password });
            setUsers(users); 
            sendEmailSimulation(username, 'register'); 
            displayMessage('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');
            
            
            isRegistering = false;
            formTitle.textContent = 'Iniciar Sesión';
            submitBtn.textContent = 'Ingresar';
            switchLink.textContent = 'Regístrate aquí';
            usernameInput.value = '';
            passwordInput.value = '';

        } else {
           
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                localStorage.setItem('currentUser', username); 
                displayMessage('bien', 'success');
                sendEmailSimulation(username, 'login');

                setTimeout(() => {
                    window.location.href = 'main.html'; 
                }, 1000);

            } else {
                displayMessage(' Usuario o contraseña incorrectos.', 'error');
            }
        }
    });

} 



if (document.body.classList.contains('main-body')) {
    const currentUser = localStorage.getItem('currentUser');
    
   
    const headerTitle = document.querySelector('.header h1');
    if (currentUser) {
        headerTitle.textContent = `Bienvenido/a a CS Skins, ${currentUser.split('@')[0].toUpperCase()}!`;
    }

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUser'); 
        window.location.href = 'index.html'; 
    });

  
    const rarities = [
        { name: 'Mil-Spec (Azul)', color: '#4b69ff', weight: 79.92, id: 'rarity-milspec' },
        { name: 'Restricted (Púrpura)', color: '#8847ff', weight: 15.98, id: 'rarity-restricted' },
        { name: 'Classified (Rosa)', color: '#d32ee6', weight: 3.2, id: 'rarity-classified' },
        { name: 'Covert (Roja)', color: '#eb4b4b', weight: 0.64, id: 'rarity-covert' },
        { name: 'Cuchillo/Guantes (Oro)', color: '#e4ae39', weight: 0.32, id: 'rarity-knife' }
    ];

    const rarityStatsList = document.getElementById('rarity-stats');
    rarities.forEach(rarity => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span><span class="rarity-color" style="background-color: ${rarity.color};"></span>${rarity.name}</span>
            <span>${rarity.weight}%</span>
        `;
        rarityStatsList.appendChild(listItem);
    });

  
    const rollDiceBtn = document.getElementById('roll-dice-btn');
    const rollResult = document.getElementById('roll-result');
    const resultBox = document.getElementById('result-box');

    rollDiceBtn.addEventListener('click', () => {
        rollDiceBtn.disabled = true; 
        resultBox.textContent = '... GIRANDO ...';
        rollResult.textContent = '';
        resultBox.style.backgroundColor = '#2c3e50';
        resultBox.style.color = 'white';

        setTimeout(() => {
            let totalWeight = rarities.reduce((sum, item) => sum + item.weight, 0);
            let randomValue = Math.random() * totalWeight;
            let cumulativeWeight = 0;
            let rolledRarity = null;

            for (const rarity of rarities) {
                cumulativeWeight += rarity.weight;
                if (randomValue <= cumulativeWeight) {
                    rolledRarity = rarity;
                    break;
                }
            }

            resultBox.style.backgroundColor = rolledRarity.color;
         
            resultBox.style.color = (rolledRarity.color === '#e4ae39') ? 'black' : 'white';
            resultBox.textContent = rolledRarity.name;
            rollResult.innerHTML = `buena pa: <span style="color:${rolledRarity.color}; font-weight:bold;">${rolledRarity.name}</span>.`;
            rollDiceBtn.disabled = false;
        }, 1500); 

    });
    

    const apiInfoDiv = document.getElementById('api-info');

    const fetchCSGOSkinInfo = async () => {
        try {
            apiInfoDiv.innerHTML = '<p>cargando datiños</p>';

           
            const simulatedDataList = [
                { name: 'AK-47 | Asiimov', wear: "Factory New", price_usd: 145.99, info: `Diseño futurista de las famosas series Asiimov. Alta demanda.`, image_url: 'https://tse2.mm.bing.net/th/id/OIP.aYDnM9PhPNYyGQDKJxVHRQHaDH?pid=Api&P=0&h=180' },
                { name: 'Karambit | Doppler (Sapphire)', wear: "Factory New", price_usd: 15000.00, info: `Una de las navajas más raras y valiosas del juego.`, image_url: 'https://tse1.mm.bing.net/th/id/OIP.D-U9TrlHuOsWZP4RxV1RuAHaCj?pid=Api&P=0&h=180' },
                { name: 'M4A4 | Howl', wear: "Minimal Wear", price_usd: 4000.00, info: `Una skin Contrabando (ilegal) muy rara y extremadamente cara.`, image_url: 'https://tse2.mm.bing.net/th/id/OIP.4enqp10R4qr21k-lZ6rZNAHaCa?pid=Api&P=0&h=180' }
            ];

            const randomIndex = Math.floor(Math.random() * simulatedDataList.length);
            const simulatedData = simulatedDataList[randomIndex];
           
            
            apiInfoDiv.innerHTML = `
                <div class="skin-card">
                    <h3>${simulatedData.name}</h3>
                    <img src="${simulatedData.image_url}" alt="${simulatedData.name}" loading="lazy">
                    <p><strong>Condición:</strong> ${simulatedData.wear}</p>
                    <p><strong>Precio (Simulado):</strong> $${simulatedData.price_usd.toFixed(2)} USD</p>
                    <p class="skin-info">${simulatedData.info}</p>
                </div>
            `;

        } catch (error) {
            console.error('Error al obtener datos de la API de Skins:', error);
            apiInfoDiv.innerHTML = `<p class="error-message">Error al cargar la información de la API. Inténtalo de nuevo.</p>`;
        }
    };

    fetchCSGOSkinInfo();

  
    const marketTrendDiv = document.getElementById('market-trend');
    const trendDescriptionP = document.getElementById('trend-description');

    const generateTrend = () => {
        const value = (Math.random() * 10).toFixed(2);
        const isPositive = Math.random() > 0.5;
        const trendIcon = isPositive ? '⬆️' : '⬇️';
        const trendColor = isPositive ? 'var(--success-color)' : 'var(--danger-color)';
        const description = isPositive ? 
            `Tendencia alcista. La demanda por ítems de esta colección ha **subido** un ${value}% en las últimas 24h.` :
            `Tendencia bajista. La oferta ha **superado** la demanda, cayendo un ${value}% en las últimas 24h.`;

        marketTrendDiv.style.color = trendColor;
        marketTrendDiv.innerHTML = `${trendIcon} ${value}%`;
        trendDescriptionP.textContent = description;
    };

    generateTrend();
    
    setInterval(generateTrend, 10000); 
}