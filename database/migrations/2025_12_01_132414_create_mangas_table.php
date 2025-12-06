<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   
     public function up()
    {
        Schema::create('mangas', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('autor');
            $table->string('url_portada', 500);
            $table->enum('estado', ['Leyendo', 'Completado', 'Pendiente', 'Abandonado']); 
            
            // Volúmenes
            $table->integer('volumen_actual')->default(0);
            $table->integer('volumenes_totales');

            // --- AGREGA ESTAS DOS LÍNEAS NUEVAS ---
            $table->integer('capitulo_actual')->default(0);
            $table->integer('capitulos_totales')->default(0);
            // --------------------------------------

            $table->timestamps();
        });
    }
};
