#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["DiaperTracker.Api/DiaperTracker.Api.csproj", "DiaperTracker.Api/"]
RUN dotnet restore "DiaperTracker.Api/DiaperTracker.Api.csproj"
COPY . .
WORKDIR "/src/DiaperTracker.Api"
RUN dotnet build "DiaperTracker.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "DiaperTracker.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DiaperTracker.Api.dll"]