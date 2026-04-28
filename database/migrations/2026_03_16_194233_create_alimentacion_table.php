<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('alimentacion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('finca_id')
                  ->constrained('fincas')
                  ->onDelete('cascade');
            $table->foreignId('lote_id')
                  ->constrained('lotes')
                  ->onDelete('cascade');
            $table->foreignId('usuario_id')
                  ->constrained('usuarios')
                  ->onDelete('restrict');
            $table->string('tipo_alimento');
            $table->decimal('cantidad_kg', 8, 2);
            $table->date('fecha');
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('alimentacion');
    }
};
