<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
     public function up()
    {
      Schema::create('mangas', function (Blueprint $table) {
        $table->id();
        
        // Información básica
        $table->string('titulo');
        $table->string('autor');
        $table->string('url_portada', 500); // 500 caracteres por si el link es largo
        
        //Estado del manga
        $table->enum('estado', ['Leyendo', 'Completado', 'Pendiente', 'Abandonado']); 
        
        // Progreso
        $table->integer('volumen_actual')->default(0);
        $table->integer('volumenes_totales');
        
        $table->timestamps(); // Fecha de creación
      });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mangas');
    }
};
