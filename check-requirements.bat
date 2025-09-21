@echo off
echo ========================================
echo    VERIFICANDO PRERREQUISITOS
echo ========================================

echo.
echo [1/4] Verificando Java...
java -version 2>nul
if %errorlevel% neq 0 (
    echo ❌ Java NO encontrado
    echo    Por favor instala Java 21 o superior desde: https://adoptium.net/
    set JAVA_OK=false
) else (
    echo ✅ Java encontrado
    set JAVA_OK=true
)

echo.
echo [2/4] Verificando Maven...
mvn -version 2>nul
if %errorlevel% neq 0 (
    echo ❌ Maven NO encontrado
    echo    Por favor instala Maven desde: https://maven.apache.org/download.cgi
    set MAVEN_OK=false
) else (
    echo ✅ Maven encontrado
    set MAVEN_OK=true
)

echo.
echo [3/4] Verificando Node.js...
node --version 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js NO encontrado
    echo    Por favor instala Node.js 18+ desde: https://nodejs.org/
    set NODE_OK=false
) else (
    echo ✅ Node.js encontrado
    set NODE_OK=true
)

echo.
echo [4/4] Verificando pnpm...
pnpm --version 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  pnpm NO encontrado, instalando...
    npm install -g pnpm
    if %errorlevel% neq 0 (
        echo ❌ Error instalando pnpm
        set PNPM_OK=false
    ) else (
        echo ✅ pnpm instalado correctamente
        set PNPM_OK=true
    )
) else (
    echo ✅ pnpm encontrado
    set PNPM_OK=true
)

echo.
echo ========================================
echo    RESUMEN DE VERIFICACION
echo ========================================

if "%JAVA_OK%"=="true" (
    echo ✅ Java: OK
) else (
    echo ❌ Java: FALTA
)

if "%MAVEN_OK%"=="true" (
    echo ✅ Maven: OK
) else (
    echo ❌ Maven: FALTA
)

if "%NODE_OK%"=="true" (
    echo ✅ Node.js: OK
) else (
    echo ❌ Node.js: FALTA
)

if "%PNPM_OK%"=="true" (
    echo ✅ pnpm: OK
) else (
    echo ❌ pnpm: FALTA
)

echo.
if "%JAVA_OK%"=="true" if "%MAVEN_OK%"=="true" if "%NODE_OK%"=="true" if "%PNPM_OK%"=="true" (
    echo 🎉 ¡Todos los prerrequisitos están instalados!
    echo    Puedes ejecutar: start-all.bat
) else (
    echo ⚠️  Instala los componentes faltantes antes de continuar
)

echo.
pause
