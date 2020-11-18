export interface Riepilogoregioni {
    data: Date;
    codice_regione: number;
    denominazione_regione: string;
    nuovi_positivi: number;
    variazione_deceduti: number;
    variazione_dimessi_guariti: number;
    variazione_ricoverati_con_sintomi: number;
    variazione_terapia_intensiva: number;
    variazione_tamponi: number;
    incidenza_7d: number;
    nuovi_positivi_7dma: number;
    nuovi_positivi_3dma: number;
    incidenza: number;
    percentuale_positivi_casi_giornaliera: number;
    percentuale_variazione_terapia_intensiva: number;
    percentuale_variazione_deceduti: number;
    percentuale_positivi_casi_7dma: number;
    cfr: number;
    variazione_terapia_intensiva_7dma: number;
    variazione_deceduti_7dma: number;
    variazione_ricoverati_con_sintomi_7dma: number;
}
