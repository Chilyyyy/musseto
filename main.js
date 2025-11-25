

const getUsers = () => JSON.parse(localStorage.getItem('registered_users')) || [];

const setUsers = (users) => localStorage.setItem('registered_users', JSON.stringify(users));




function checkAuthAndRedirect() {
    
    const currentUser = localStorage.getItem('currentUser'); 
    const isLoginPage = document.body.classList.contains('login-body');

    if (currentUser && isLoginPage) {
        window.location.href = 'main.html';
    } else if (!currentUser && !isLoginPage) {
        window.location.href = 'index.html';
    }
}

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
         
            if (users.find(u => u.username === username)) {
                displayMessage('Error: El usuario ya está registrado. Por favor, inicia sesión.', 'error');
                return;
            }
            users.push({ username, password });
            setUsers(users); 
            sendEmailSimulation(username, 'register');
            displayMessage('puedes iniciar sesión.', 'success');
            
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
                displayMessage('¡Login exitoso! Redirigiendo...', 'success');
                sendEmailSimulation(username, 'login');

                setTimeout(() => {
                    window.location.href = 'main.html'; 
                }, 1000);

            } else {
                displayMessage('Error: Usuario o contraseña incorrectos.', 'error');
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

 
    const rollDiceBtn = document.getElementById('roll-dice-btn');
    const rollResult = document.getElementById('roll-result');
    const resultBox = document.getElementById('result-box');

    const rarities = [
        { name: 'Mil-Spec (Azul)', color: '#4b69ff', weight: 79.92 },
        { name: 'Restricted (Púrpura)', color: '#8847ff', weight: 15.98 },
        { name: 'Classified (Rosa)', color: '#d32ee6', weight: 3.2 },
        { name: 'Covert (Roja)', color: '#eb4b4b', weight: 0.64 },
        { name: 'Cuchillo/Guantes (Amarillo/Oro)', color: '#e4ae39', weight: 0.32 }
    ];

    rollDiceBtn.addEventListener('click', () => {
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
        resultBox.textContent = rolledRarity.name;
        rollResult.innerHTML = `¡Obtuviste una skin de rareza: <span style="color:${rolledRarity.color}; font-weight:bold;">${rolledRarity.name}</span>!`;
 
    });
    
   
    const apiInfoDiv = document.getElementById('api-info');

   
    const fetchCSGOSkinInfo = async () => {
        try {
            apiInfoDiv.innerHTML = '<p>cargando datiños</p>';

           
            const randomItemIds = ['M4A4 | Asiimov', 'AWP | Fade', 'AK-47 | Redline'];
            const randomIndex = Math.floor(Math.random() * randomItemIds.length);
            const selectedItem = randomItemIds[randomIndex];
            
       
            const simulatedData = {
                name: selectedItem,
                wear: "Factory New",
                price_usd: randomIndex === 1 ? 1250.00 : randomIndex === 0 ? 55.75 : 12.50,
                info: `Esta es una de las skins más populares en la comunidad de CS. La versión **${selectedItem.split('|')[1].trim()}** es conocida por su diseño icónico.`,
                image_url: `https://simulacion.csgofloat.com/skins/${selectedItem.replace(/ /g, '_')}.png`
            };

           
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

}

