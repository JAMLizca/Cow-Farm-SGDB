<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Raza;
use Illuminate\Support\Facades\Validator;

class RazaController extends Controller
{
    // Listar todas las razas
    public function index()
    {
        $razas = Raza::all();

        return response()->json($razas, 200);
    }

    // Mostrar una raza
    public function show($id)
    {
        $raza = Raza::find($id);

        if (!$raza) {
            return response()->json([
                'message' => 'Raza no encontrada'
            ], 404);
        }

        return response()->json($raza, 200);
    }

    // Crear una raza
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre'   => 'required|string|unique:razas',
            'proposito' => 'required|in:Carne,Leche,Doble propósito',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error de validación',
                'errors'  => $validator->errors()
            ], 422);
        }

        $raza = Raza::create($request->all());

        return response()->json([
            'message' => 'Raza creada correctamente',
            'raza'    => $raza
        ], 201);
    }

    // Actualizar una raza
    public function update(Request $request, $id)
    {
        $raza = Raza::find($id);

        if (!$raza) {
            return response()->json([
                'message' => 'Raza no encontrada'
            ], 404);
        }

        $raza->update($request->all());

        return response()->json([
            'message' => 'Raza actualizada correctamente',
            'raza'    => $raza
        ], 200);
    }

    // Eliminar una raza
    public function destroy($id)
    {
        $raza = Raza::find($id);

        if (!$raza) {
            return response()->json([
                'message' => 'Raza no encontrada'
            ], 404);
        }

        $raza->delete();

        return response()->json([
            'message' => 'Raza eliminada correctamente'
        ], 200);
    }
}