<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('razas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->enum('proposito', [
                'Carne', 'Leche', 'Doble propósito'
            ]);
            $table->string('origen')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('razas');
    }
};