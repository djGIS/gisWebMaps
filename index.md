<div style="background-color:#003366;width:800px;height:40px;padding: 5px;">
		<span style="color:Gainsboro; font-family: arial,helvetica,sans-serif;font-size: 14pt;"><b>miSIG-FADEEAC</b></span></br>
		<span style="color:Gainsboro; font-family: arial,helvetica,sans-serif;font-size: 12pt;">Buscador de Servicios y Rutas para el Autotransporte de Cargas</span>
	</div>
	<div style="position:relative;width:800px;height:450px;padding: 5px;">
		<div id="miSIGmapa" style="width:100%;height:100%;"></div>
	</div>
	<div id="Layers" style="background-color:#003366;width:800px;padding: 5px;float:left;">
		<div id="HelpLayers" style="float:left;display: none;">
			<span style="color:Gainsboro; font-family: arial,helvetica,sans-serif;font-size: 10pt;">
				<p>Puede seleccionar capas multiples del mismo rubro mateniendo presionado la tecla [Ctrl] al mismo tiempo que selecciona con el mouse.</p>
				<p>Para filtrar los resultados y rafinar su busqueda, use la casilla titulado <i>Buscar en Servicios en Ruta</i>, entrando las palabras claves que quiere buscar.</p>
			</span>
		</div>
		<span style="font-family: arial,helvetica,sans-serif;font-size: 10pt;">
		<table width="100%">
			<tr>
				<td width="20%" align="right"><span style="color:Gainsboro;">Buscar en Servicios : </span></td>
				<td width="60%"><input type="textbox" id="filtroServicios" placeholder="Introduce una palabra para filtrar los resultados de servicios (ej. YPF)." style="width:98.5%"></td>
				<td width="20%"><input type="button" value="Buscar" onclick="filtrarServicios(dbPOIimport)" style="width:100%"></td>
			</tr>
		</table>
		</span>
	</div>
	<div id="warningsPanel" style="background-color:Gainsboro;float:left;width:800px;padding: 5px;">
		<div style="background-color:#FFFF00;width:100%">
			<span style="font-family: arial,helvetica,sans-serif;font-size: 12pt;">
				<table width="100%">
					<tr>
						<td width="80%"><b>Advertencias</b></td>
						<td width="20%" align="right"><a href="#miSIGmapa" onclick="showHelpAdvertencias()">[?]</a></td>
					</tr>
				</table>
			</span>
		</div>
		
    </div>
    <div id="directionsPanel" style="background-color:Gainsboro;float:left;width:800px;padding: 5px;">
		<div style="background-color:#33CCFF;width:100%">
			<span style="font-family: arial,helvetica,sans-serif;font-size: 12pt;">
				<table width="100%">
					<tr>
						<td width="80%"><b>Indicaciones</b></td>
						<td width="20%" align="right"><a href="#miSIGmapa" onclick="showHelpIndicaciones()">[?]</a></td>
					</tr>
				</table>
			</span>
		</div>
		<span id="advertirPeajes" style="font-family: arial,helvetica,sans-serif;font-size: 9pt;width:100%"></span>
		<span id="indicaciones" style="font-family: arial,helvetica,sans-serif;font-size: 10pt;width:100%"></span>
    </div>