Config.load({
    // define o nome do aplicativo a ser usado ao consultar o servidor de configuração
    appName: "corporativo-backend-servicos",
    // "remote" consultará o servidor de configuração, "remoteSkipAuth" consultará o servidor de configuração ignorando a etapa de autorização e "local" lerá de um arquivo yaml local
    configLocation: "remoteSkipAuth",
    // perfil a ser usado ao consultar o servidor de configuração, por exemplo, "dev", "uat", "prod"
    profile: "dev",
    // o nome do servidor de configuração no PCF
    configServerName: "myConfigServer",
    // propriedade opcional para controlar o registro da configuração carregada no console
    logPropriedades: true,
    // propriedade opcional para controlar a atualização automática da configuração com base em determinado intervalo (segundos)
    intervalo: 10000
})
    .then(() => { // no carregamento bem-sucedido, inicie seu aplicativo
        const app = express()
        app.get('/', function (req, res) {
            res.send('Olá Mundo')
        })
        app.listen(3000)
    })
    .catch(erro => {
        console.log(erro);
    });