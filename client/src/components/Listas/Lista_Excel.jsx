/* COMPONENTE DE BOTON DESCARGAR LISTA EN EXCEL */
import { React } from 'react';
import ExcelJS from 'exceljs';
import { Toaster, toast } from 'react-hot-toast'; 
import '../css/listas.css'

const ListExcel = (props) => {
  const handleGenerateExcel = async () => {
    let save = 'datos'
    if (props.save !== undefined) {
      save = props.save
    }
    if (props.tipo !== undefined) {
      if (props.tipo === 'inforApps' || props.tipo === 'inforDevice') {
        for (let i = 0; i < props.data.length; i++) {
          if (props.data[i].ip.startsWith('000.') || props.data[i].ip.startsWith('Sin')) {
            props.data[i].ip = 'Sin inventario'
          }
          if (props.data[i].ip.startsWith('001.') || props.data[i].ip.startsWith('No')) {
            props.data[i].ip = 'No aplica'
          }
        }
      }
    }
    function formatearFecha(fechaISO) {
      const fechaSolo = fechaISO.split('T')[0]; 
      return `${fechaSolo}`;
    }
    if (props.tipo !== undefined) {
      if (props.tipo === 'inforMante') {
        for (let i = 0; i < props.data.length; i++) {
          if (props.data[i].realizado === null || props.data[i].realizado === 'null') {
            props.data[i].realizado = 'Pendiente'
          }
          else {
            props.data[i].realizado = formatearFecha(`${props.data[i].realizado}`)
          }
        }
      }
    }
    if (props.tipo === 'inforApps') {
      save = `${props.data[0].economico} Dispositivos`
    }
    if (props.tipo === 'inforDevice') {
      save = `${props.data[0].nombre}`
    }
    if (props.tipo === 'inforMante') {
      save = `${props.data[0].economico} Mantenimientos`
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${save}`);

    const columnToHide = 'id';

    const columns = Object.keys(props.data[0]).map(key => ({
      header: key,
      key: key,
      width: key.length < 20 ? 20 : key.length
    }));
    worksheet.columns = columns;

    worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } }; 
      cell.alignment = { horizontal: 'center' }; 
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '227447' }, 
      };
    });

    const columnIndex = worksheet.columns.findIndex(col => col.key === columnToHide);
    if (columnIndex !== -1) {
      worksheet.getColumn(columnIndex + 1).hidden = true; 
    }

    props.data.forEach(item => {
      worksheet.addRow(item);
    });

    const buffer = await workbook.xlsx.writeBuffer(); 
    const url = window.URL.createObjectURL(new Blob([buffer])); 
    const a = document.createElement('a'); 
    a.href = url;
    a.download = `${save}.xlsx`; 
    a.click(); 
    window.URL.revokeObjectURL(url); 

    let tostada = `${save}`
    toast(tostada, { position: 'bottom-right' });

  };

  return (
    <>
      <button className={((props.tipo === 'inforApps' || props.tipo === 'inforMante') ? 'excel listaExcel' : props.tipo === 'inforDevice' ? 'excel listaExcelD' : 'excel')} onClick={handleGenerateExcel}>{props.titulo}</button>
      <Toaster />
    </>
  );
};

export { ListExcel };