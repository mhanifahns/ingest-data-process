module.exports = {
    "people": {
      "index_name": "people_track",
      "mapping": {
        "properties": {
          "date": {
            "type": "date"
          },
          "phone_number": {
            "type": "keyword"
          },
          "name": {
            "type": "keyword"
          },
          "nik": {
            "type": "keyword"
          },
          "location": {
            "type": "geo_point"
          },
          "operator_celular":{
            "type": "keyword"
          }
        }
      }
    },
    "ktp": {
      "index_name": "people_demogrpahy",
      "mapping": {
        "properties": {
          "DATE": {
            "type": "date"
          },
          "PHONE_NUMBER": {
            "type": "keyword"
          },
          "PROVIDER": {
            "type": "keyword"
          },
          "NAMA_KAB": {
            "type": "keyword"
          },
          "NAMA_KEC": {
            "type": "keyword"
          },
          "DEMOGRAPHY_GEOLOCATION": {
            "type": "geo_point"
          },
          "NAMA_PROP":{
            "type": "keyword"
          },
          "GOL_DARAH":{
            "type": "keyword"
          },
          "NAMA_KEL":{
            "type": "keyword"
          },
          "EXTERNAL_ID":{
            "type": "keyword"
          },
          "EXTERNAL_ID":{
            "type": "keyword"
          },
          "NAMA_LGKP":{
            "type": "keyword"
          },
          "AGAMA":{
            "type": "keyword"
          },
          "KODE_POS":{
            "type": "keyword"
          },
          "DUSUN":{
            "type": "keyword"
          },
          "TGL_LHR":{
            "type": "date"
          },
          "WARGA_NEGARA":{
            "type": "keyword"
          },
          "NAMA_LGKP_IBU":{
            "type": "keyword"
          },
          "PEKERJAAN":{
            "type": "keyword"
          },
          "STAT_HBKEL":{
            "type": "keyword"
          },
          "NO_KK":{
            "type": "keyword"
          },
          "NO_RT":{
            "type": "keyword"
          },
          "NIK":{
            "type": "keyword"
          },
          "ALAMAT":{
            "type": "keyword"
          },
          "NO_RW":{
            "type": "keyword"
          },
          "STAT_KWN":{
            "type": "keyword"
          },
          "JENIS_KLMIN":{
            "type": "keyword"
          },
          "SOURCE":{
            "type": "keyword"
          },
          "TIME_CREATE":{
            "type": "keyword"
          },
          "ID_USER":{
            "type": "keyword"
          },
          "ID_PROFILE":{
            "type": "keyword"
          }
        }
      }
    },
    "bts": {
      "index_name": "bts_demography",
      "mapping": {
        "properties": {
          "radio": {
            "type": "keyword"
          },
          "mcc": {
            "type": "keyword"
          },
          "provider": {
            "type": "keyword"
          },
          "net": {
            "type": "keyword"
          },
          "area": {
            "type": "keyword"
          },
          "demography_geolocation": {
            "type": "geo_point"
          },
          "cell":{
            "type": "keyword"
          },
          "unit":{
            "type": "keyword"
          },
          "range":{
            "type": "keyword"
          },
          "sample":{
            "type": "keyword"
          },
          "changeable":{
            "type": "keyword"
          },
          "created":{
            "type": "keyword"
          },
          "updated":{
            "type": "keyword"
          },
          "averageSignal":{
            "type": "keyword"
          },
          "date":{
            "type": "date"
          }
        }
      }
    },
    "spbu": {
      "index_name": "spbu_geolocation",
      "mapping": {
        "properties": {
          "AgentNo": {
            "type": "keyword"
          },
          "Tipe_Agent": {
            "type": "keyword"
          },
          "Region": {
            "type": "keyword"
          },
          "Provinsi": {
            "type": "keyword"
          },
          "Kota": {
            "type": "keyword"
          },
          "Geolocation": {
            "type": "geo_point"
          },
          "Alamat":{
            "type": "keyword"
          },
          "Date":{
            "type": "date"
          }
        }
      }
    },
    "mobility": {
      "index_name": "indonesian_mobility",
      "mapping": {
        "properties": {
          "country_region_code": {
            "type": "keyword"
          },
          "country_region": {
            "type": "keyword"
          },
          "sub_region_1": {
            "type": "keyword"
          },
          "sub_region_2": {
            "type": "keyword"
          },
          "metro_area": {
            "type": "keyword"
          },
          "iso_3166_2_code": {
            "type": "keyword"
          },
          "census_fips_code":{
            "type": "keyword"
          },
          "place_id": {
            "type": "keyword"
          },
          "date":{
            "type": "date"
          },
          "retail_and_recreation_percent_change_from_baseline": {
            "type": "long"
          },
          "grocery_and_pharmacy_percent_change_from_baseline":{
            "type": "long"
          },
          "parks_percent_change_from_baseline":{
            "type": "long"
          },
          "transit_stations_percent_change_from_baseline":{
            "type": "long"
          },
          "workplaces_percent_change_from_baseline":{
            "type": "long"
          },
          "residential_percent_change_from_baseline":{
            "type": "long"
          }
        }
      }
    },
    "ID_Region_Mobility_Report": {
      "index_name": "ID_Region_Mobility_Report",
      "mapping": {
        "properties": {
          "country_region_code": {
            "type": "keyword"
          },
          "country_region": {
            "type": "keyword"
          },
          "sub_region_1": {
            "type": "keyword"
          },
          "sub_region_2": {
            "type": "keyword"
          },
          "metro_area": {
            "type": "keyword"
          },
          "iso_3166_2_code": {
            "type": "keyword"
          },
          "census_fips_code":{
            "type": "keyword"
          },
          "place_id": {
            "type": "keyword"
          },
          "date":{
            "type": "date"
          },
          "retail_and_recreation_percent_change_from_baseline": {
            "type": "long"
          },
          "grocery_and_pharmacy_percent_change_from_baseline":{
            "type": "long"
          },
          "parks_percent_change_from_baseline":{
            "type": "long"
          },
          "transit_stations_percent_change_from_baseline":{
            "type": "long"
          },
          "workplaces_percent_change_from_baseline":{
            "type": "long"
          },
          "residential_percent_change_from_baseline":{
            "type": "long"
          }
        }
      }
    },
  
    
  };
  