export type SummaryPenerimaManfaat = {
  summary_penerima_manfaat: {
    total_penerima_manfaat: number;
    tk_paud: number;
    sd_mi: number;
    smp_mts: number;
    sma_smk_ma: number;
    yayasan: number;
    balita: number;
    bumil: number;
    busui: number;
  };
};

export type SummaryPenerimaManfaatInner = {
  total_penerima_manfaat: number;
  tk_paud: number;
  sd_mi: number;
  smp_mts: number;
  sma_smk_ma: number;
  yayasan: number;
  balita: number;
  bumil: number;
  busui: number;
};

export type SummaryDapur = {
  summary_dapur: {
    operasional: {
      total_dapur: number;
      dapur_aktif: number;
      dapur_nonaktif: number;
    };
    sebaran: {
      kecamatan_id: number;
      kecamatan: string;
      jumlah_dapur: number;
    }[];
  };
};

export type SummaryDapurInner = {
  operasional: {
    total_dapur: number;
    dapur_aktif: number;
    dapur_nonaktif: number;
  };
  sebaran: {
    kecamatan_id: number;
    kecamatan: string;
    jumlah_dapur: number;
  }[];
};
