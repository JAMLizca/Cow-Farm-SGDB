<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bovino extends Model
{
    protected $table = 'bovinos';

    protected $fillable = [
        'finca_id',
        'raza_id',
        'lote_id',
        'arete',
        'nombre',
        'sexo',
        'categoria',
        'fecha_nacimiento',
        'peso_inicial',
        'estado_salud',
        'proposito',
        'activo',
    ];

    // Relaciones
    public function finca()
    {
        return $this->belongsTo(Finca::class, 'finca_id');
    }

    public function raza()
    {
        return $this->belongsTo(Raza::class, 'raza_id');
    }

    public function lote()
    {
        return $this->belongsTo(Lote::class, 'lote_id');
    }

    public function produccionLeche()
    {
        return $this->hasMany(ProduccionLeche::class, 'bovino_id');
    }

    public function pesajes()
    {
        return $this->hasMany(Pesaje::class, 'bovino_id');
    }

    public function eventosSanitarios()
    {
        return $this->hasMany(EventoSanitario::class, 'bovino_id');
    }
}