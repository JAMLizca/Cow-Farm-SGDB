<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BovinoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\RazaController;
use App\Http\Controllers\LoteController;
use App\Http\Controllers\ProduccionLecheController;
use App\Http\Controllers\PesajeController;
use App\Http\Controllers\EventoSanitarioController;
use App\Http\Controllers\AlimentacionController;

// Ruta de login
Route::post('/login', [AuthController::class, 'login']);

// Rutas de Bovinos
Route::get('/bovinos',        [BovinoController::class, 'index']);
Route::get('/bovinos/{id}',   [BovinoController::class, 'show']);
Route::post('/bovinos',       [BovinoController::class, 'store']);
Route::put('/bovinos/{id}',   [BovinoController::class, 'update']);
Route::delete('/bovinos/{id}',[BovinoController::class, 'destroy']);

// Rutas de Usuarios
Route::get('/usuarios',        [UsuarioController::class, 'index']);
Route::get('/usuarios/{id}',   [UsuarioController::class, 'show']);
Route::post('/usuarios',       [UsuarioController::class, 'store']);
Route::put('/usuarios/{id}',   [UsuarioController::class, 'update']);
Route::delete('/usuarios/{id}',[UsuarioController::class, 'destroy']);

// Rutas de Razas
Route::get('/razas',        [RazaController::class, 'index']);
Route::get('/razas/{id}',   [RazaController::class, 'show']);
Route::post('/razas',       [RazaController::class, 'store']);
Route::put('/razas/{id}',   [RazaController::class, 'update']);
Route::delete('/razas/{id}',[RazaController::class, 'destroy']);

// Rutas de Lotes
Route::get('/lotes',        [LoteController::class, 'index']);
Route::get('/lotes/{id}',   [LoteController::class, 'show']);
Route::post('/lotes',       [LoteController::class, 'store']);
Route::put('/lotes/{id}',   [LoteController::class, 'update']);
Route::delete('/lotes/{id}',[LoteController::class, 'destroy']);

// Rutas de Produccion Leche
Route::get('/produccion-leche',        [ProduccionLecheController::class, 'index']);
Route::get('/produccion-leche/{id}',   [ProduccionLecheController::class, 'show']);
Route::post('/produccion-leche',       [ProduccionLecheController::class, 'store']);
Route::put('/produccion-leche/{id}',   [ProduccionLecheController::class, 'update']);
Route::delete('/produccion-leche/{id}',[ProduccionLecheController::class, 'destroy']);

// Rutas de Pesajes
Route::get('/pesajes',        [PesajeController::class, 'index']);
Route::get('/pesajes/{id}',   [PesajeController::class, 'show']);
Route::post('/pesajes',       [PesajeController::class, 'store']);
Route::put('/pesajes/{id}',   [PesajeController::class, 'update']);
Route::delete('/pesajes/{id}',[PesajeController::class, 'destroy']);

// Rutas de Eventos Sanitarios
Route::get('/eventos-sanitarios',        [EventoSanitarioController::class, 'index']);
Route::get('/eventos-sanitarios/{id}',   [EventoSanitarioController::class, 'show']);
Route::post('/eventos-sanitarios',       [EventoSanitarioController::class, 'store']);
Route::put('/eventos-sanitarios/{id}',   [EventoSanitarioController::class, 'update']);
Route::delete('/eventos-sanitarios/{id}',[EventoSanitarioController::class, 'destroy']);

// Rutas de Alimentacion
Route::get('/alimentacion',        [AlimentacionController::class, 'index']);
Route::get('/alimentacion/{id}',   [AlimentacionController::class, 'show']);
Route::post('/alimentacion',       [AlimentacionController::class, 'store']);
Route::put('/alimentacion/{id}',   [AlimentacionController::class, 'update']);
Route::delete('/alimentacion/{id}',[AlimentacionController::class, 'destroy']);