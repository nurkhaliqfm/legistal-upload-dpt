"use client";

import ProgressBar from "@/components/progressBar";
import axios from "axios";
import { useState } from "react";

import { getDatabase, ref, child, get, set, push } from "firebase/database";
import { signInWithEmailAndPassword } from "firebase/auth";

import { firebaseDatabase, firebaseAuth } from "@/components/firebaseConfig";

signInWithEmailAndPassword(
  firebaseAuth,
  "admin@hadinitesolution.com",
  "sembarangmosaja"
);

interface dataTPSProps {
  idTps: string;
  nama: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  alamat: string;
}

interface dataDPTProps {
  idData: string;
  nik: string;
  noKK: string;
  nama: string;
  jenisKelamin: string;
  tempatLahir: string;
  tanggalLahir: string;
  prov: string;
  kab: string;
  kec: string;
  kel: string;
  alamat: string;
  noTlp: string;
  tpsTerdaftar: string;
  tpsPencoblosan: string;
  foto: string;
  ttd: string;
  idTps: string;
  umur: number;
}

const firebaseLocationPath = "TBDaftarLokasi/Indonesia";
const firebaseDPTNonLocationPath = "TBDaftarDPTNoLokasi";
const firebaseDPTPath = "TBDaftarDPT";
const firebaseTPSPath = "TBDaftarTPS";
const currentYear = `${new Date().getFullYear()}`;

const dbRef = ref(getDatabase());

export default function ItemMahasiswa({ data }: any) {
  const [progress, setProgress] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  const handleProgressbarDone = (status: boolean) => {
    setProgress(status);
  };

  const handleProgressbarPercentage = (current: number, from: number) => {
    setProgressValue(Math.ceil((current / from) * 100));
  };

  // DONE: Handle TPS Create
  const handleCreateTpsBaru = (
    item: any,
    currentProgress: number,
    fromProgress: number
  ) => {
    const newPostKey = push(child(dbRef, firebaseTPSPath)).key;
    if (newPostKey !== null) {
      const data: dataTPSProps = {
        idTps: newPostKey,
        nama: item.TPS.padStart(2, "0"),
        provinsi: item.Provinsi,
        kabupaten: item.Kabupaten,
        kecamatan: item.Kecamatan,
        kelurahan: item.Kelurahan,
        alamat: item["Alamat TPS"],
      };

      set(
        ref(firebaseDatabase, `${firebaseTPSPath}/${newPostKey}/Data`),
        data
      ).then(() => {
        handleProgressbarPercentage(currentProgress, fromProgress);
      });

      handleAddNewDataTps(data);
      handleUpdateRekapTps(data);
    } else {
      handleProgressbarPercentage(currentProgress, fromProgress);
    }
  };

  // DONE: Handle Make New TPS
  const handleAddNewDataTps = (item: dataTPSProps) => {
    const provinsiPath = `${item.provinsi}/TBDaftarTPS/${item.idTps}`;
    const kabupatenPath = `${item.provinsi}/${item.kabupaten}/TBDaftarTPS/${item.idTps}`;
    const kecamatanPath = `${item.provinsi}/${item.kabupaten}/${item.kecamatan}/TBDaftarTPS/${item.idTps}`;
    const kelurahanPath = `${item.provinsi}/${item.kabupaten}/${item.kecamatan}/${item.kelurahan}/TBDaftarTPS/${item.nama}`;

    set(
      ref(firebaseDatabase, `${firebaseLocationPath}/${provinsiPath}`),
      item.idTps
    );
    set(
      ref(firebaseDatabase, `${firebaseLocationPath}/${kabupatenPath}`),
      item.idTps
    );
    set(
      ref(firebaseDatabase, `${firebaseLocationPath}/${kecamatanPath}`),
      item.idTps
    );
    set(
      ref(firebaseDatabase, `${firebaseLocationPath}/${kelurahanPath}`),
      item.idTps
    );
  };

  // DONE: Handle Update Rekap TPS
  const handleUpdateRekapTps = (item: dataTPSProps) => {
    const provinsiPath = `${item.provinsi}/RekapDataDPT/jumlahTPS`;
    const kabupatenPath = `${item.provinsi}/${item.kabupaten}/RekapDataDPT/jumlahTPS`;
    const kecamatanPath = `${item.provinsi}/${item.kabupaten}/${item.kecamatan}/RekapDataDPT/jumlahTPS`;
    const kelurahanPath = `${item.provinsi}/${item.kabupaten}/${item.kecamatan}/${item.kelurahan}/RekapDataDPT/jumlahTPS`;

    get(child(dbRef, `${firebaseLocationPath}/${provinsiPath}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const currentValue = snapshot.val() + 1;
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${provinsiPath}`),
            currentValue
          );
        } else {
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${provinsiPath}`),
            1
          );
        }
      }
    );

    get(child(dbRef, `${firebaseLocationPath}/${kabupatenPath}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const currentValue = snapshot.val() + 1;
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kabupatenPath}`),
            currentValue
          );
        } else {
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kabupatenPath}`),
            1
          );
        }
      }
    );

    get(child(dbRef, `${firebaseLocationPath}/${kecamatanPath}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const currentValue = snapshot.val() + 1;
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kecamatanPath}`),
            currentValue
          );
        } else {
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kecamatanPath}`),
            1
          );
        }
      }
    );

    get(child(dbRef, `${firebaseLocationPath}/${kelurahanPath}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const currentValue = snapshot.val() + 1;
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kelurahanPath}`),
            currentValue
          );
        } else {
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kelurahanPath}`),
            1
          );
        }
      }
    );
  };

  // DONE: Handle TPS Button
  const handleCekTPS = async (itemDPT: any) => {
    setProgress(true);
    const dataSize = 5;
    const batchSize = Math.ceil(itemDPT.length / dataSize);

    for (let i = 0; i < batchSize; i++) {
      const startIndex = i * dataSize;
      const batchItems = itemDPT.slice(startIndex, startIndex + dataSize);
      for (const item of batchItems) {
        const firebaseAdditionPath = `${item.Provinsi}/${item.Kabupaten}/${item.Kecamatan}/Kelurahan/${item.Kelurahan}`;
        const firebaseTPSinLocation = `${item.Provinsi}/${item.Kabupaten}/${item.Kecamatan}/${item.Kelurahan}/TBDaftarTPS`;

        const nik = item["NIK"].replace("nik", "");
        let tanggaLahir = nik.substring(6, 12);
        let jenisKelamin =
          parseInt(nik.substring(6, 8)) > 40 ? "Perempuan" : "Laki";

        const yearsNow = parseInt(currentYear.substring(2, 4)) + 2000;
        const birthYear =
          parseInt(nik.substring(10, 12)) <
          parseInt(currentYear.substring(2, 4))
            ? parseInt(nik.substring(10, 12)) + 2000
            : parseInt(nik.substring(10, 12)) + 1900;

        let umur = yearsNow - birthYear;

        // NOTE: Check TPS Location
        get(
          child(dbRef, `${firebaseLocationPath}/${firebaseAdditionPath}`)
        ).then((snapshot) => {
          if (snapshot.exists()) {
            // NOTE: Check TPS Is Exists
            get(
              child(
                dbRef,
                `${firebaseLocationPath}/${firebaseTPSinLocation}/${item.TPS.padStart(
                  2,
                  "0"
                )}`
              )
            ).then((snapshot) => {
              if (snapshot.exists()) {
                handleCreateTpsBaru(item, i, batchSize);
              } else {
                handleProgressbarPercentage(i, batchSize);
              }
            });
          } else {
            // NOTE: Add DPT To DPT Nonlokasi
            get(child(dbRef, `${firebaseDPTNonLocationPath}/${nik}`)).then(
              (snapshot) => {
                if (!snapshot.exists()) {
                  set(
                    ref(
                      firebaseDatabase,
                      `${firebaseDPTNonLocationPath}/${nik}`
                    ),
                    {
                      alamatTps: item["Alamat TPS"],
                      jenisKelamin: jenisKelamin,
                      kabupaten: item.Kabupaten,
                      kecamatan: item.Kecamatan,
                      kelurahan: item.Kelurahan,
                      namaDPT: item["Nama Pemilih"],
                      nik: nik,
                      noTps: item["TPS"].padStart(2, "0"),
                      provinsi: item.Provinsi,
                      tanggalLahir: tanggaLahir,
                      umur: umur,
                    }
                  );
                  handleProgressbarPercentage(i, batchSize);
                } else {
                  handleProgressbarPercentage(i, batchSize);
                }
              }
            );
          }
        });
      }
    }
  };

  // NOTE: Handle Make New DPT
  const handleAddNewDataDpt = (item: dataDPTProps) => {
    const provinsiPath = `${item.prov}/TBDaftarDPT/${item.nik}`;
    const kabupatenPath = `${item.prov}/${item.kab}/TBDaftarDPT/${item.nik}`;
    const kecamatanPath = `${item.prov}/${item.kab}/${item.kec}/TBDaftarDPT/${item.nik}`;
    const kelurahanPath = `${item.prov}/${item.kab}/${item.kec}/${item.kel}/TBDaftarDPT/${item.nik}`;
    const tpsPath = `${item.idTps}/TBDaftarDPT/${item.nik}`;

    set(
      ref(firebaseDatabase, `${firebaseLocationPath}/${provinsiPath}`),
      item.nik
    );
    set(
      ref(firebaseDatabase, `${firebaseLocationPath}/${kabupatenPath}`),
      item.nik
    );
    set(
      ref(firebaseDatabase, `${firebaseLocationPath}/${kecamatanPath}`),
      item.nik
    );
    set(
      ref(firebaseDatabase, `${firebaseLocationPath}/${kelurahanPath}`),
      item.nik
    );
    set(ref(firebaseDatabase, `${firebaseTPSPath}/${tpsPath}`), item.nik);
  };

  // NOTE: Handle Update Rekap DPT
  const handleUpdateRekapDpt = (item: dataDPTProps) => {
    const provinsiPath = `${item.prov}/RekapDataDPT/jumlahDPT`;
    const kabupatenPath = `${item.prov}/${item.kab}/RekapDataDPT/jumlahDPT`;
    const kecamatanPath = `${item.prov}/${item.kab}/${item.kec}/RekapDataDPT/jumlahDPT`;
    const kelurahanPath = `${item.prov}/${item.kab}/${item.kec}/${item.kel}/RekapDataDPT/jumlahDPT`;
    const tpsPath = `${item.idTps}/RekapDataDPT/jumlahDPT`;

    get(child(dbRef, `${firebaseLocationPath}/${provinsiPath}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const currentValue = snapshot.val() + 1;
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${provinsiPath}`),
            currentValue
          );
        } else {
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${provinsiPath}`),
            1
          );
        }
      }
    );

    get(child(dbRef, `${firebaseLocationPath}/${kabupatenPath}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const currentValue = snapshot.val() + 1;
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kabupatenPath}`),
            currentValue
          );
        } else {
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kabupatenPath}`),
            1
          );
        }
      }
    );

    get(child(dbRef, `${firebaseLocationPath}/${kecamatanPath}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const currentValue = snapshot.val() + 1;
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kecamatanPath}`),
            currentValue
          );
        } else {
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kecamatanPath}`),
            1
          );
        }
      }
    );

    get(child(dbRef, `${firebaseLocationPath}/${kelurahanPath}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const currentValue = snapshot.val() + 1;
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kelurahanPath}`),
            currentValue
          );
        } else {
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kelurahanPath}`),
            1
          );
        }
      }
    );

    get(child(dbRef, `${firebaseTPSPath}/${tpsPath}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const currentValue = snapshot.val() + 1;
        set(
          ref(firebaseDatabase, `${firebaseTPSPath}/${tpsPath}`),
          currentValue
        );
      } else {
        set(ref(firebaseDatabase, `${firebaseTPSPath}/${tpsPath}`), 1);
      }
    });
  };

  // NOTE: Handle Make New Data Kelamin DPT
  const handleAddNewDataKelaminDpt = (item: dataDPTProps) => {
    const additionPath =
      item.jenisKelamin === "Laki" ? "TBDaftarDPTLaki" : "TBDaftarDPTPerempuan";

    const provinsiPath = `${item.prov}/${additionPath}/${item.nik}`;
    const kabupatenPath = `${item.prov}/${item.kab}/${additionPath}/${item.nik}`;
    const kecamatanPath = `${item.prov}/${item.kab}/${item.kec}/${additionPath}/${item.nik}`;
    const kelurahanPath = `${item.prov}/${item.kab}/${item.kec}/${item.kel}/${additionPath}/${item.nik}`;
    const tpsPath = `${item.idTps}/${additionPath}/${item.nik}`;

    set(
      ref(firebaseDatabase, `${firebaseLocationPath}/${provinsiPath}`),
      item.nik
    );
    set(
      ref(firebaseDatabase, `${firebaseLocationPath}/${kabupatenPath}`),
      item.nik
    );
    set(
      ref(firebaseDatabase, `${firebaseLocationPath}/${kecamatanPath}`),
      item.nik
    );
    set(
      ref(firebaseDatabase, `${firebaseLocationPath}/${kelurahanPath}`),
      item.nik
    );
    set(ref(firebaseDatabase, `${firebaseTPSPath}/${tpsPath}`), item.nik);
  };

  // NOTE: Handle Update Rekap Data Kelamin DPT
  const handleUpdateRekapDataKelaminDpt = (item: dataDPTProps) => {
    const additionPath =
      item.jenisKelamin === "Laki" ? "jumlahDPTLaki" : "jumlahDPTPerempuan";

    const provinsiPath = `${item.prov}/RekapDataDPT/${additionPath}`;
    const kabupatenPath = `${item.prov}/${item.kab}/RekapDataDPT/${additionPath}`;
    const kecamatanPath = `${item.prov}/${item.kab}/${item.kec}/RekapDataDPT/${additionPath}`;
    const kelurahanPath = `${item.prov}/${item.kab}/${item.kec}/${item.kel}/RekapDataDPT/${additionPath}`;
    const tpsPath = `${item.idTps}/RekapDataDPT/${additionPath}`;

    get(child(dbRef, `${firebaseLocationPath}/${provinsiPath}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const currentValue = snapshot.val() + 1;
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${provinsiPath}`),
            currentValue
          );
        } else {
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${provinsiPath}`),
            1
          );
        }
      }
    );

    get(child(dbRef, `${firebaseLocationPath}/${kabupatenPath}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const currentValue = snapshot.val() + 1;
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kabupatenPath}`),
            currentValue
          );
        } else {
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kabupatenPath}`),
            1
          );
        }
      }
    );

    get(child(dbRef, `${firebaseLocationPath}/${kecamatanPath}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const currentValue = snapshot.val() + 1;
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kecamatanPath}`),
            currentValue
          );
        } else {
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kecamatanPath}`),
            1
          );
        }
      }
    );

    get(child(dbRef, `${firebaseLocationPath}/${kelurahanPath}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const currentValue = snapshot.val() + 1;
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kelurahanPath}`),
            currentValue
          );
        } else {
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kelurahanPath}`),
            1
          );
        }
      }
    );

    get(child(dbRef, `${firebaseTPSPath}/${tpsPath}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const currentValue = snapshot.val() + 1;
        set(
          ref(firebaseDatabase, `${firebaseTPSPath}/${tpsPath}`),
          currentValue
        );
      } else {
        set(ref(firebaseDatabase, `${firebaseTPSPath}/${tpsPath}`), 1);
      }
    });
  };

  // NOTE: Handle Make New Data Umur DPT
  const handleAddNewDataUmurDpt = (item: dataDPTProps) => {
    let additionPath;
    if (item.umur < 20) {
      additionPath = "TBDaftarDPTUmur20";
    } else if (item.umur < 30) {
      additionPath = "TBDaftarDPTUmur30";
    } else if (item.umur < 40) {
      additionPath = "TBDaftarDPTUmur40";
    } else if (item.umur < 50) {
      additionPath = "TBDaftarDPTUmur50";
    } else if (item.umur < 60) {
      additionPath = "TBDaftarDPTUmur60";
    } else {
      additionPath = "TBDaftarDPTUmur70";
    }

    const provinsiPath = `${item.prov}/${additionPath}/${item.nik}`;
    const kabupatenPath = `${item.prov}/${item.kab}/${additionPath}/${item.nik}`;
    const kecamatanPath = `${item.prov}/${item.kab}/${item.kec}/${additionPath}/${item.nik}`;
    const kelurahanPath = `${item.prov}/${item.kab}/${item.kec}/${item.kel}/${additionPath}/${item.nik}`;
    const tpsPath = `${item.idTps}/${additionPath}/${item.nik}`;

    set(
      ref(firebaseDatabase, `${firebaseLocationPath}/${provinsiPath}`),
      item.nik
    );
    set(
      ref(firebaseDatabase, `${firebaseLocationPath}/${kabupatenPath}`),
      item.nik
    );
    set(
      ref(firebaseDatabase, `${firebaseLocationPath}/${kecamatanPath}`),
      item.nik
    );
    set(
      ref(firebaseDatabase, `${firebaseLocationPath}/${kelurahanPath}`),
      item.nik
    );
    set(ref(firebaseDatabase, `${firebaseTPSPath}/${tpsPath}`), item.nik);
  };

  // NOTE: Handle Update Rekap Data DPT
  const handleUpdateRekapDataUmurDpt = (item: dataDPTProps) => {
    let additionPath;
    if (item.umur < 20) {
      additionPath = "jumlahDPTUmur20";
    } else if (item.umur < 30) {
      additionPath = "jumlahDPTUmur30";
    } else if (item.umur < 40) {
      additionPath = "jumlahDPTUmur40";
    } else if (item.umur < 50) {
      additionPath = "jumlahDPTUmur50";
    } else if (item.umur < 60) {
      additionPath = "jumlahDPTUmur60";
    } else {
      additionPath = "jumlahDPTUmur70";
    }

    const provinsiPath = `${item.prov}/RekapDataDPT/${additionPath}`;
    const kabupatenPath = `${item.prov}/${item.kab}/RekapDataDPT/${additionPath}`;
    const kecamatanPath = `${item.prov}/${item.kab}/${item.kec}/RekapDataDPT/${additionPath}`;
    const kelurahanPath = `${item.prov}/${item.kab}/${item.kec}/${item.kel}/RekapDataDPT/${additionPath}`;
    const tpsPath = `${item.idTps}/RekapDataDPT/${additionPath}`;

    get(child(dbRef, `${firebaseLocationPath}/${provinsiPath}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const currentValue = snapshot.val() + 1;
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${provinsiPath}`),
            currentValue
          );
        } else {
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${provinsiPath}`),
            1
          );
        }
      }
    );

    get(child(dbRef, `${firebaseLocationPath}/${kabupatenPath}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const currentValue = snapshot.val() + 1;
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kabupatenPath}`),
            currentValue
          );
        } else {
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kabupatenPath}`),
            1
          );
        }
      }
    );

    get(child(dbRef, `${firebaseLocationPath}/${kecamatanPath}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const currentValue = snapshot.val() + 1;
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kecamatanPath}`),
            currentValue
          );
        } else {
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kecamatanPath}`),
            1
          );
        }
      }
    );

    get(child(dbRef, `${firebaseLocationPath}/${kelurahanPath}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const currentValue = snapshot.val() + 1;
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kelurahanPath}`),
            currentValue
          );
        } else {
          set(
            ref(firebaseDatabase, `${firebaseLocationPath}/${kelurahanPath}`),
            1
          );
        }
      }
    );

    get(child(dbRef, `${firebaseTPSPath}/${tpsPath}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const currentValue = snapshot.val() + 1;
        set(
          ref(firebaseDatabase, `${firebaseTPSPath}/${tpsPath}`),
          currentValue
        );
      } else {
        set(ref(firebaseDatabase, `${firebaseTPSPath}/${tpsPath}`), 1);
      }
    });
  };

  // NOTE: Handle DPT Create
  const handleCreateDptBaru = (
    item: any,
    currentProgress: number,
    fromProgress: number
  ) => {
    const nik = item["NIK"].replace("nik", "");
    let tanggaLahir = nik.substring(6, 12);
    let jenisKelamin =
      parseInt(nik.substring(6, 8)) > 40 ? "Perempuan" : "Laki";

    const yearsNow = parseInt(currentYear.substring(2, 4)) + 2000;
    const birthYear =
      parseInt(nik.substring(10, 12)) < parseInt(currentYear.substring(2, 4))
        ? parseInt(nik.substring(10, 12)) + 2000
        : parseInt(nik.substring(10, 12)) + 1900;

    let umur = yearsNow - birthYear;

    const data: dataDPTProps = {
      idData: "-",
      nik: nik,
      noKK: "-",
      nama: item["Nama Pemilih"],
      jenisKelamin: jenisKelamin,
      tempatLahir: "-",
      tanggalLahir: tanggaLahir,
      prov: item.Provinsi,
      kab: item.Kabupaten,
      kec: item.Kecamatan,
      kel: item.Kelurahan,
      alamat: "-",
      noTlp: "-",
      tpsTerdaftar: item.TPS.padStart(2, "0"),
      tpsPencoblosan: "-",
      foto: "-",
      ttd: "-",
      idTps: item.idTps,
      umur: umur,
    };

    console.log(data);

    set(ref(firebaseDatabase, `${firebaseDPTPath}/${nik}/Data`), data).then(
      () => {
        handleProgressbarPercentage(currentProgress, fromProgress);
      }
    );

    handleAddNewDataDpt(data);
    handleUpdateRekapDpt(data);
    handleAddNewDataKelaminDpt(data);
    handleUpdateRekapDataKelaminDpt(data);
    handleAddNewDataUmurDpt(data);
    handleUpdateRekapDataUmurDpt(data);
  };

  // NOTE: Handle DPT Button
  const handleCekDPT = async (itemDPT: any) => {
    setProgress(true);
    const dataSize = 1;
    const batchSize = Math.ceil(itemDPT.length / dataSize);

    for (let i = 0; i < batchSize; i++) {
      const startIndex = i * dataSize;
      const batchItems = itemDPT.slice(startIndex, startIndex + dataSize);
      for (const item of batchItems) {
        const firebaseAdditionPath = `${item.Provinsi}/${item.Kabupaten}/${item.Kecamatan}/Kelurahan/${item.Kelurahan}`;
        const firebaseTPSinLocation = `${item.Provinsi}/${item.Kabupaten}/${item.Kecamatan}/${item.Kelurahan}/TBDaftarTPS`;

        // NOTE: Check TPS Location
        get(
          child(dbRef, `${firebaseLocationPath}/${firebaseAdditionPath}`)
        ).then((snapshot) => {
          if (snapshot.exists()) {
            // NOTE: Check TPS Is Exists
            get(
              child(
                dbRef,
                `${firebaseLocationPath}/${firebaseTPSinLocation}/${item.TPS.padStart(
                  2,
                  "0"
                )}`
              )
            ).then((snapshot) => {
              if (snapshot.exists()) {
                item.idTps = snapshot.val();
                get(
                  child(
                    dbRef,
                    `${firebaseDPTPath}/${item["NIK"].replace("nik", "")}`
                  )
                ).then((snapshot) => {
                  if (!snapshot.exists()) {
                    console.log(snapshot.val());
                    handleCreateDptBaru(item, i, batchSize);
                  } else {
                    handleProgressbarPercentage(i, batchSize);
                  }
                });
              } else {
                handleProgressbarPercentage(i, batchSize);
              }
            });
          } else {
            handleProgressbarPercentage(i, batchSize);
          }
        });
      }
    }
  };

  return (
    <>
      <button
        onClick={() => handleCekDPT(data)}
        disabled={progress}
        className={`my-4 mr-4 ${
          !progress
            ? "bg-blue-400 hover:bg-blue-800 text-white"
            : "bg-slate-400 text-white"
        }  font-semibold hover:shadow-lg shadow-md rounded-lg px-4 py-2`}
      >
        Cek Data DPT
      </button>

      <button
        onClick={() => handleCekTPS(data)}
        disabled={progress}
        className={`my-4 ${
          !progress
            ? "bg-blue-400 hover:bg-blue-800 text-white"
            : "bg-slate-400 text-white"
        }  font-semibold hover:shadow-lg shadow-md rounded-lg px-4 py-2`}
      >
        Cek Data TPS
      </button>
      <ProgressBar
        handle={handleProgressbarDone}
        state={progress}
        value={progressValue}
      />
      <section className="grid grid-cols-1 md:grid-cols-2 mdx:grid-cols-3 xl:grid-cols-4 gap-4 mt-4 grid-flow-row">
        {data.map((item: any, index: number) => {
          return (
            <div key={index} className="shadow-lg rounded-md p-4">
              <h1 className="text-base font-semibold leading-5 text-clip">
                {index + 1}. {item["Nama Pemilih"]} {`(TPS ${item["TPS"]})`}
              </h1>
              <p className="text-xs">NIK : {item["NIK"].replace("nik", "")}</p>
              <p className="text-xs">Provinsi : {item.Provinsi}</p>
              <p className="text-xs">Kabupaten : {item.Kabupaten}</p>
              <p className="text-xs">Kecamatan : {item.Kecamatan}</p>
              <p className="text-xs">Kelurahan : {item.Kelurahan}</p>
              <p className="text-xs">Alamat TPS : {item["Alamat TPS"]}</p>
            </div>
          );
        })}
      </section>
    </>
  );
}
