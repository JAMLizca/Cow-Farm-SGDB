<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('bovinos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('finca_id')
                  ->constrained('fincas')
                  ->onDelete('cascade');
            $table->foreignId('raza_id')
                  ->constrained('razas')
                  ->onDelete('restrict');
            $table->foreignId('lote_id')
                  ->nullable()
                  ->constrained('lotes')
                  ->onDelete('set null');
            $table->string('arete')->unique();
            $table->string('nombre');
            $table->enum('sexo', ['Macho', 'Hembra']);
            $table->enum('categoria', [
                'Toro', 'Vaca', 'Ternero',
                'Ternera', 'Novillo', 'Novilla', 'Becerro'
            ]);
            $table->date('fecha_nacimiento')->nullable();
            $table->decimal('peso_inicial', 8, 2)->nullable();
            $table->enum('estado_salud', [
                'Saludable', 'En observación', 'En tratamiento'
            ])->default('Saludable');
            $table->enum('proposito', [
                'Carne', 'Leche', 'Doble propósito', 'Cría'
            ]);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('bovinos');
    }
};