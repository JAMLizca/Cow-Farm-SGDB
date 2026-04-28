<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('eventos_sanitarios', function (Blueprint $table) {
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
            $table->enum('tipo', [
                'Vacunación', 'Desparasitación',
                'Tratamiento', 'Revisión'
            ]);
            $table->string('producto');
            $table->string('dosis')->nullable();
            $table->date('fecha');
            $table->date('proxima_fecha')->nullable();
            $table->enum('estado', [
                'Programado', 'Ejecutado', 'Cancelado'
            ])->default('Programado');
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('eventos_sanitarios');
    }
};