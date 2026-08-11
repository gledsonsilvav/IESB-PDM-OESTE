# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# Estrutura de Arquivos do Projeto Expo

- **package.json**: Gerencia as dependências (bibliotecas) e scripts de execução do projeto.
- **package-lock.json**: Registra as versões exatas de todas as dependências instaladas para garantir consistência.
- **app/** (ou **App.js/App.tsx**): Contém as telas e componentes visuais da aplicação.
- **app.json**: Arquivo de configuração do Expo (nome do app, ícones, orientação da tela, etc.).
- **assets/**: Pasta para armazenar arquivos estáticos, como imagens, fontes e ícones.
- **node_modules/**: Pasta onde ficam armazenados os códigos de todas as bibliotecas instaladas via npm.
- **.gitignore**: Especifica arquivos e pastas que o Git não deve rastrear ou enviar ao repositório.
- **.expo/**: Pasta gerada pelo Expo para guardar configurações de build local e cache de execução.