import { Factura } from "@/components/funciones/funciones";

/**
 * Función para descargar una factura.
 * El usuario puede modificar los parámetros o la lógica de generación (ej. usar una librería de PDF) en el futuro.
 * Por ahora, genera un archivo de texto simple con los datos de la factura.
 */
export function descargarFactura(factura: Factura) {
    try {
        const contenido = `
FACTURA: ${factura.secuencial}
FECHA: ${factura.fecha}
CLIENTE: ${factura.cliente.razonSocial}
RUC/CI: ${factura.cliente.identificacion}
DIRECCIÓN: ${factura.cliente.direccion}

DETALLES:
${factura.detalles.map(d => `- ${d.descripcion} x${d.cantidad}: $${Number(d.precioUnitario).toFixed(2)}`).join("\n")}

-----------------------------
SUBTOTAL: $${factura.subtotal.toFixed(2)}
DESCUENTO: $${factura.totalDescuento.toFixed(2)}
BASE IMPONIBLE: $${factura.baseImponible.toFixed(2)}
IVA (${(factura.ivaRate * 100).toFixed(0)}%): $${factura.valorIVA.toFixed(2)}
TOTAL: $${factura.total.toFixed(2)}
    `.trim();

        const blob = new Blob([contenido], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `factura_${factura.secuencial}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error al descargar la factura:", error);
        alert("Hubo un error al intentar descargar la factura.");
    }
}
