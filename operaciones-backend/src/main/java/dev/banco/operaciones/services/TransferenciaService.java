package dev.banco.operaciones.services;

import dev.banco.operaciones.models.Transferencia;

import java.util.List;

public interface TransferenciaService {

    Transferencia realizarTranferencia(Transferencia transferencia);
    List<Transferencia> findAll();
}
