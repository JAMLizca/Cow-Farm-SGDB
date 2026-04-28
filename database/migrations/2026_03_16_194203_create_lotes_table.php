<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('lotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('finca_id')
                  ->constrained('fincas')
                  ->onDelete('cascade');
            $table->string('nombre');
            $table->integer('capacidad')->nullable();
            $table->text('descripcion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('lotes');
    }
};