<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventoSanitario extends Model
{
    protected $table = 'eventos_sanitarios';

    protected $fillable = [
        'finca_id',
        'bovino_id',
        'usuario_id',
        'tipo',
        'producto',
        'dosis',
        'fecha',
        'proxima_fecha',
        'estado',
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