<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bovino;
use Illuminate\Support\Facades\Validator;

class BovinoController extends Controller
{
    // Listar todos los bovinos de una finca
    public function index(Request $request)
    {
        $bovinos = Bovino::with(['raza', 'lote'])
                         ->where('finca_id', $request->finca_id)
                         ->where('activo', true)
                         ->get();

        return response()->json($bovinos, 200);
    }

    // Mostrar un bovino
    public function show($id)
    {
        $bovino = Bovino::with(['raza', 'lote'])
                        ->find($id);

        if (!$bovino) {
            return response()->json([
                'message' => 'Bovino no encontrado'
            ], 404);
        }

        return response()->json($bovino, 200);
    }

    // Registrar un bovino
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'finca_id'        => 'required|exists:fincas,id',
            'raza_id'         => 'required|exists:razas,id',
            'arete'           => 'required|string|unique:bovinos',
            'nombre'          => 'required|string',
            'sexo'            => 'required|in:Macho,Hembra',
            'categoria'       => 'required|in:Toro,Vaca,Ternero,Ternera,Novillo,Novilla,Becerro',
            'estado_salud'    => 'required|in:Saludable,En observación,En tratamiento',
            'proposito'       => 'required|in:Carne,Leche,Doble propósito,Cría',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error de validación',
                'errors'  => $validator->errors()
            ], 422);
        }

        $bovino = Bovino::create($request->all());

        return response()->json([
            'message' => 'Bovino registrado correctamente',
            'bovino'  => $bovino
        ], 201);
    }

    // Actualizar un bovino
    public function update(Request $request, $id)
    {
        $bovino = Bovino::find($id);

        if (!$bovino) {
            return response()->json([
                'message' => 'Bovino no encontrado'
            ], 404);
        }

        $bovino->update($request->all());

        return response()->json([
            'message' => 'Bovino actualizado correctamente',
            'bovino'  => $bovino
        ], 200);
    }

    // Eliminar un bovino
    public function destroy($id)
    {
        $bovino = Bovino::find($id);

        if (!$bovino) {
            return response()->json([
                'message' => 'Bovino no encontrado'
            ], 404);
        }

        $bovino->update(['activo' => false]);

        return response()->json([
            'message' => 'Bovino eliminado correctamente'
        ], 200);
    }
}