<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

// 1. ARREGLO VISUAL: Si entran a la raíz, los mandamos a tu HTML
Route::get('/', function () {
    return redirect('/index.html');
});

// 2. ARREGLO TÉCNICO: Ruta secreta para crear las tablas en Render
Route::get('/migrar-ahora', function () {
    try {
        // Limpiamos la memoria para evitar errores de conexión viejos
        Artisan::call('config:clear');
        
        // Ejecutamos la migración (crear tablas)
        Artisan::call('migrate', ["--force" => true]);
        
        return '<h1 style="color:green; text-align:center; font-family:sans-serif; margin-top:50px;">✅ ¡ÉXITO TOTAL! <br> La tabla de Mangas se creó correctamente.</h1>';
    } catch (\Exception $e) {
        // Si falla, nos muestra el error en pantalla
        return '<h1 style="color:red; font-family:sans-serif;">❌ ERROR:</h1><pre>' . $e->getMessage() . '</pre>';
    }
});