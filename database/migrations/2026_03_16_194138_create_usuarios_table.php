<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('finca_id')
                  ->constrained('fincas')
                  ->onDelete('cascade');
            $table->string('nombre');
            $table->string('email')->nullable();
            $table->string('password');
            $table->enum('rol', ['admin', 'empleado']);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('usuarios');
    }
};