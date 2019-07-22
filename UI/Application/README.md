# Getting Started?

- **Make sure you have at least Node 10.x.x or higher (w/ npm 6+) installed!**  
- **This repository uses ASP.Net Core 2.2, which has a hard requirement on .NET Core Runtime 2.2 and .NET Core SDK 2.2. Please install these items from [here](https://devblogs.microsoft.com/dotnet/announcing-net-core-2-2/)**


### Visual Studio 2017

Make sure you have .NET Core 2.2 installed and/or VS2017 15.3.
VS2017 will automatically install all the neccessary npm & .NET dependencies when you open the project.

Simply push F5 to start debugging !

### Visual Studio Code

> Note: Make sure you have the C# extension & .NET Core Debugger installed.

The project comes with the configured Launch.json files to let you just push F5 to start the project.

```bash
# cd into the directory you cloned the project into
npm install && npm run build:dev && dotnet restore
# or yarn install
```

If you're running the project from command line with `dotnet run` make sure you set your environment variables to Development (otherwise things like HMR might not work).

```bash
# on Windows:
set ASPNETCORE_ENVIRONMENT=Development
# on Mac/Linux
export ASPNETCORE_ENVIRONMENT=Development 
```
