<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProduccionLeche extends Model
{
    protected $table = 'produccion_leche';

    protected $fillable = [
        'finca_id',
        'bovino_id',
        'usuario_id',
        'fecha',
        'turno',
        'cantidad_litros',
        'observaciones',
    ];

    // Relaciones
    public function finca()
    {
        return $this->belongsTo(Finca::class, 'finca_id');
    }

    public function bovino()
    {
        return $this->belongsTo(Bovino::class, 'bovino_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}