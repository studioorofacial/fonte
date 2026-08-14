document.addEventListener("DOMContentLoaded", function(){
    const formulario = document.getElementById("formLogin")
    const resultado = document.getElementById("resultado")
    
    formulario.addEventListener("submit", function(event){
        event.preventDefault()

        const loginUser = document.getElementById("loginID").value
        const passUser = document.getElementById("passwordID").value
        // Credenciais valídas
        const loginSys = "adenilson"
        const passSys = 123456
        // Comparação de usuário e senha verdadeira
        if ( loginSys == loginUser && passSys == passUser) {
            // Resultado valído.
            /* resultado.innerHTML = `
                <h3>Dados Recebidos</h3>
                <p><strong>Login:</strong> ${loginUser}</p>
                <p><strong>Senha:</strong> ${passUser}</p>
            `*/
            // Falha no login
            alert("Login realizado com sucesso! ")
        } else {
            // Falha no login
            alert("Usuário ou senha incorreta!")
        }
    })

    formulario.addEventListener("reset", function(event){
        resultado.innerHTML = ``
    })
})