<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

// 1. ARREGLO VISUAL: Si entran a la raíz, los mandamos a tu HTML
Route::get('/', function () {
    return redirect('/index.html');
});

Route::get('/migrar-ahora', function () {
    try {
        Artisan::call('config:clear');
        
        // CAMBIO AQUÍ: Usamos 'migrate:fresh' para reconstruir la tabla con las columnas nuevas
        Artisan::call('migrate:fresh', ["--force" => true]);
        
        return '<h1 style="color:green; text-align:center;">¡LISTO! Base de datos reconstruida con columnas de Capítulos.</h1>';
    } catch (\Exception $e) {
        return '<h1 style="color:red">ERROR:</h1><pre>' . $e->getMessage() . '</pre>';
    }
});