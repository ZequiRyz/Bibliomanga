<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MangaController;

// GET: Ver todos los mangas
Route::get('/mangas', [MangaController::class, 'index']);

// POST: Agregar un manga nuevo
Route::post('/mangas', [MangaController::class, 'store']);

// PUT: Actualizar un manga (por ID)
Route::put('/mangas/{id}', [MangaController::class, 'update']);

// DELETE: RUTA PARA BORRAR
Route::delete('/mangas/{id}', [MangaController::class, 'destroy']);