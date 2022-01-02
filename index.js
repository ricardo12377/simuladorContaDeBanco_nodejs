const inquirer = require('inquirer');
const fs = require('fs');

operation();

function operation () {
    
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar conta',
            'Consultar saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ],
      }
    ])
    .then((response) => {
        const action = response['action']

        if(action == 'Criar conta'){
            createAccount()
        } else if (action == 'Depositar'){
            deposit()
        } else if (action == 'Consultar saldo'){
            getAccountBalance()
        } else if (action == 'Sacar'){
            withdraw()
        } else if (action =='Sair'){
            console.log('Obrigado por usar o Accounts')
            process.exit()
        }
    })
    .catch((err) => console.log(err))
}


function createAccount () {
   console.log('Parabéns por escolher o nosso banco!')
   console.log('Defina as opções da sua conta a seguir')
   buildAccount()
}

function buildAccount () {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para sua conta:'
        }
    ])
    .then((response) => {
        const accountName = response['accountName']

        console.info(accountName)

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log('Essa conta já existe, escolha outra conta')
            buildAccount()
        }

        fs.writeFileSync(
            `accounts/${accountName}.json`,
            '{"balance": 0}',
            function(err) {
                console.log(err)
            }
        )

        console.log('Parabéns, a sua conta foi criada')
    })
    .catch((err) => console.log(err))
}


function deposit () {

    inquirer.prompt([
        {
            name:'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((response) => {

        const accountName = response['accountName']

        if(checkAccount(accountName)){
            return deposit()
        }
        
        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar?'
            }
        ]).then((response) => {

            const amout = response['amount']

            addAmount(accountName, amout)
            operation()
        })
    })
    .catch((err) => console.log(err))
}




function checkAccount (accountName) {
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log('Essa conta não existe, escolha outro nome')
        return false
    }

    return true
}

function addAmount (accountName, amount) {
    const account = getAccount(accountName)

    if(!amount) {
        console.log('Ocorreu um erro, tente mais tarde')
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )

    console.log(`Foi depositado o valor de : ${amount} na sua conta`)
}

function getAccount (accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)
}

function getAccountBalance () {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((response) => {

        const accountName = response['accountName']

        if(!checkAccount(accountName)){
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)

        console.log(`Olá, o saldo da sua conta é de ${accountData.balance }`)
    })
}

function withdraw (accountName) {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((response) => {

        const accountName = response['accountName']

        if(!checkAccount(accountName)) {
            return withdraw
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja sacar?'
            }
        ]).then((response) => {
            const amount = response['amount']


            removeAccount()
            operation()
        })
        .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
}

function removeAmount (accountName, amount) {

    const accountData = getAccount(accountName)

    if(!amount) {
        console.log('Ocorreu um erro, tente novamente mais tarde')
    }

    if(accountData.balance < amount) {
        console.log('Valo indisponível')
        return withdraw
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )

    console.log(`Foi realizado um saque de R$ ${amount} da sua conta!`)
}