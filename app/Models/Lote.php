<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lote extends Model
{
    protected $table = 'lotes';

    protected $fillable = [
        'finca_id',
        'nombre',
        'capacidad',
        'descripcion',
        'activo',
    ];

    // Relaciones
    public function finca()
    {
        return $this->belongsTo(Finca::class, 'finca_id');
    }

    public function bovinos()
    {
        return $this->hasMany(Bovino::class, 'lote_id');
    }

    public function alimentacion()
    {
        return $this->hasMany(Alimentacion::class, 'lote_id');
    }
}