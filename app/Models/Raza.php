<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Raza extends Model
{
    protected $table = 'razas';

    protected $fillable = [
        'nombre',
        'descripcion',
        'proposito',
        'origen',
    ];

    // Relaciones
    public function bovinos()
    {
        return $this->hasMany(Bovino::class, 'raza_id');
    }
}