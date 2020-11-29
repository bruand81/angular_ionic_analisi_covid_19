export interface Province {
    url: string;
    data: Date;
    codice_regione: number;
    denominazione_regione: string;
    codice_provincia: number;
    denominazione_provincia: string;
    sigla_provincia: string;
    lat: number;
    long: number;
    totale_casi: number;
    incidenza: number;
    variazione_totale_casi: number;
    percentuale_variazione_totale_casi: number;
    variazione_totale_casi_3dma: number;
    variazione_totale_casi_7dma: number;
    incidenza_7d: number;
    nuovi_positivi_7dsum: number;
    nuovi_positivi_7d_incr: number;
}
