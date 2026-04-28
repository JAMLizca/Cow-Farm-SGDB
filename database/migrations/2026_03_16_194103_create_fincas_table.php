<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('fincas', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_finca')->unique();
            $table->string('nombre');
            $table->string('password');
            $table->string('logo_url')->nullable();
            $table->string('direccion')->nullable();
            $table->string('propietario');
            $table->string('telefono')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('fincas');
    }
};