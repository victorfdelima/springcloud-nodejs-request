# cloud-foundry-config-client

[![Greenkeeper badge](https://badges.greenkeeper.io/adamkl/cloud-foundry-config-client.svg)](https://greenkeeper.io/)
[![versão npm](https://badge.fury.io/js/cloud-foundry-config-client.svg)](https://badge.fury.io/js/cloud-foundry-config-client )
[![Status da compilação](https://travis-ci.org/adamkl/cloud-foundry-config-client.svg?branch=master)](https://travis-ci.org/adamkl/cloud-foundry -config-cliente)

Um cliente simples para puxar a configuração de um PCF Spring Cloud Config Server

## Instalação

```
npm instalar cloud-foundry-config-client
```

ou

```
yarn add cloud-foundry-config-client
```

## Uso

`cloud-foundry-config-client` expõe um método usado para carregar a configuração no início da aplicação e uma propriedade estática para ler o objeto de configuração carregado atualmente.

A primeira etapa é `carregar` a configuração de um Sprint Cloud Config Server (ou opcionalmente de um arquivo yaml local):

```javascript
// index.js
import * as express from 'express';
import { Config } from 'cloud-foundry-config-client';
...
Config.load({
  // define o nome do aplicativo a ser usado ao consultar o servidor de configuração
  appName: "myExpressApp",
  // "remote" consultará o servidor de configuração, "remoteSkipAuth" consultará o servidor de configuração ignorando a etapa de autorização e "local" lerá de um arquivo yaml local
  configLocation: "remote",
  // perfil a ser usado ao consultar o servidor de configuração, por exemplo, "dev", "uat", "prod"
  profile: "dev",
  // o nome do servidor de configuração no PCF
  configServerName: "myConfigServer",
  // propriedade opcional para controlar o registro da configuração carregada no console
  logPropriedades: true | false | undefined,
  // propriedade opcional para controlar a atualização automática da configuração com base em determinado intervalo (segundos)
  intervalo: number | undefined
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
```

Uma vez carregada a configuração, ela pode ser acessada em qualquer outro módulo comprando referenciando a propriedade `current` no objeto `Config`:

```javascript
import * como jwt de 'express-jwt';
import { Config } de 'cloud-foundry-config-client';

...
// Obtém o segredo JWT que foi recuperado do servidor de configuração
const { jwt_secret } = Config.current;

app.use(jwt({ segredo: jwt_secret }));
app.use((err, req, res, próximo) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("token inválido...");
  }
});

}
```

## Considerações

Atualmente, este é um cliente muito básico e, como tal, impõe algumas limitações no uso do Spring Cloud Config Server.

- Este cliente foi testado apenas com um repositório git apoiando o servidor de configuração
- O cliente espera que os arquivos yaml de configuração sejam armazenados na raiz do repositório de backup git com a seguinte convenção de nome de arquivo: `{appName}-{profile}.yml //(por exemplo, myExpressApp-dev.yml)`

## Carregando de um arquivo local

Se você ainda não teve a chance de configurar um Cloud Foundry Cloud Config Server, você pode fingir carregando a configuração de um arquivo yaml local:

```javascript
Config.load({
  appName: "myExpressApp",
  configLocation: "local", // obtém a configuração do arquivo yaml local
  perfil: "dev",
  configServerName: "myConfigServer"
})
...
```

Ao carregar de um arquivo local, o cloud-foundry-config-client espera que o arquivo tenha um caminho e nome de arquivo específicos com base no `{ appName, profile, configServerName }` passado para a função de carregamento. Esses parâmetros são usados ​​para construir o caminho e o nome do arquivo com base na seguinte convenção:

```bash
// relativo ao diretório de trabalho atual
./{configServerName}/{appName}-{profile}.yml
```

O que, em nosso exemplo acima, se traduz em:

```bash
./myConfigServer/myExpressApp-dev.yml
```

## Carregando de um servidor de configuração remoto enquanto executa o aplicativo localmente

Também é possível carregar a configuração de um Cloud Foundry Config Server enquanto executa seu aplicativo localmente. `cloud-foundry-config-client` procura na variável de ambiente VCAP_SERVICES para encontrar as credenciais do cliente necessárias para se conectar a um Config Server (baseado em `{ configServerName }` passado para a função `load`).

Se você quiser carregar sua configuração de um Config Server remoto enquanto estiver executando localmente, copie o VCAP_SERVICES relevante para sua máquina local e defina uma variável de ambiente VCAP_SERVICES antes de executar seu aplicativo ou, mais facilmente, copie o JSON em um `vcap_services.json ` na raiz da pasta do seu aplicativo:

``` json
// vcap_services.js
// cloud-foundry-config-client verifica aqui se não
// A variável de ambiente VCAP_SERVICES foi encontrada

{
  "p-config-server": [
    {
      "credenciais": {
        "uri": "local.config",
        "client_secret": "secreto",
        "client_id": "id",
        "access_token_uri": "local.token"
      },
      "nome": "configuração de teste"
    }
  ]
}
```

Em seguida, basta iniciar seu aplicativo localmente, especificando `{ configLocation = "remote" }` i