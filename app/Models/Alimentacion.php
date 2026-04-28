<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alimentacion extends Model
{
    protected $table = 'alimentacion';

    protected $fillable = [
        'finca_id',
        'lote_id',
        'usuario_id',
        'tipo_alimento',
        'cantidad_kg',
        'fecha',
        'observaciones',
    ];

    // Relaciones
    public function finca()
    {
        return $this->belongsTo(Finca::class, 'finca_id');
    }

    public function lote()
    {
        return $this->belongsTo(Lote::class, 'lote_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}