"use client";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import ItemDPT from "../import-dpt/itemDPT";

// tbDataDPT.setIdData("-");
//             tbDataDPT.setNik(tbdprri.getNIK());
//             tbDataDPT.setNoKK("-");
//             tbDataDPT.setNama(tbdprri.getNamaDPT());
//             tbDataDPT.setJenisKelamin(tbdprri.getJenisKelamin());
//             tbDataDPT.setTempatLahir("-");
//             tbDataDPT.setTanggalLahir(tbdprri.getTanggalLahir());
//             tbDataDPT.setProv(tbdprri.getProvinsi());
//             tbDataDPT.setKab(tbdprri.getKabupaten());
//             tbDataDPT.setKec(tbdprri.getKecamatan());
//             tbDataDPT.setKel(tbdprri.getKelurahan());
//             tbDataDPT.setAlamat("-");
//             tbDataDPT.setNotlp("-");
//             tbDataDPT.setTpsterdaftar(tbdprri.getNoTps());
//             tbDataDPT.setTpspencoblosan("-");
//             tbDataDPT.setFoto("-");
//             tbDataDPT.setTtd("-");
//             tbDataDPT.setIdTps("-");
//             tbDataDPT.setUmur(tbdprri.getUmur());

interface dataDPTProps {
  idData?: string;
  nik?: string;
  noKK?: string;
  nama?: string;
  jenisKelamin?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  prov?: string;
  kab?: string;
  kec?: string;
  kel?: string;
  alamat?: string;
  noTlp?: string;
  tpsTerdaftar?: string;
  tpsPencoblosan?: string;
  foto?: string;
  ttd?: string;
  idTps?: string;
  umur?: string;
}

interface dataTPSProps {
  idTps?: string;
  nama?: string;
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;
  kelurahan?: string;
  alamat?: string;
}

export default function Page() {
  const [dataDPT, setDataDPT] = useState<dataDPTProps[]>([]);
  const [dataTPS, setDataTPS] = useState<dataTPSProps[]>([]);
  const [dataFetch, setDataFetch] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChanged = (event: any) => {
    setIsLoading(true);
    const fileCsv = event.target.files[0];

    Papa.parse(fileCsv, {
      header: true,
      skipEmptyLines: true,
      complete: function (result) {
        setDataFetch((prevData) => [...prevData, result.data]);
      },
    });
  };

  useEffect(() => {
    if (dataFetch.length > 0) {
      setDataDPT(dataFetch[0]);
      setIsLoading(false);
    }
  }, [dataFetch]);

  return (
    <main className="my-4 lg:mx-16">
      {dataDPT && dataDPT.length > 0 ? (
        <>
          <ItemDPT mahasiswaBaru={dataDPT} />
        </>
      ) : (
        <>
          <input
            type="file"
            id="file"
            accept=".csv"
            onChange={handleFileChanged}
          />
          {isLoading && (
            <>
              <main className="w-full min-h-screen flex flex-col justify-center items-center">
                <div
                  className="flex justify-center items-center h-10 w-10 animate-spin rounded-full border-4 border-solid border-black  border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                >
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                  </span>
                </div>
                <span className="my-4 text-lg font-medium">
                  Extract Data...
                </span>
              </main>
            </>
          )}
        </>
      )}
    </main>
  );
}
