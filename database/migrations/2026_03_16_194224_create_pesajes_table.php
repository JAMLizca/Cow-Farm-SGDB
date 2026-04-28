<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('pesajes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('finca_id')
                  ->constrained('fincas')
                  ->onDelete('cascade');
            $table->foreignId('bovino_id')
                  ->constrained('bovinos')
                  ->onDelete('cascade');
            $table->foreignId('usuario_id')
                  ->constrained('usuarios')
                  ->onDelete('restrict');
            $table->date('fecha');
            $table->decimal('peso_kg', 8, 2);
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('pesajes');
    }
};