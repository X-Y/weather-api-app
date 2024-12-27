import { http, HttpResponse } from 'msw';

export const handlers = [
  http.options('*', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.set('Access-Control-Allow-Origin', '*'), // Allow all origins
      ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'), // Allowed methods
      ctx.set('Access-Control-Allow-Headers', '*') // Allowed headers
    );
  }),

  http.get('https://geocoding-api.open-meteo.com/v1/search', ({ request }, res, ctx) => {
    const url = new URL(request.url)
    const name = url.searchParams.get('name')
    const latitude = {
      'New York': 0.1,
      Stockholm: 1.1
    }[name]
    const data = {
      "results": [
        {
          "id": 5128581,
          "name": name,
          "latitude": latitude,
          "longitude": -74.00597,
          "elevation": 10.0,
          "feature_code": "PPL",
          "country_code": "US",
          "admin1_id": 5128638,
          "timezone": "America/New_York",
          "population": 8175133,
          "postcodes": [
            "10001",
            "10002",
            "10003",
          ],
          "country_id": 6252001,
          "country": "United States",
          "admin1": "New York"
        }
      ],
      "generationtime_ms": 0.7870197
    }
    return HttpResponse.json(
      data
    );
  }),

  http.get('https://api.open-meteo.com/v1/forecast', ({ request }, res, ctx) => {
    const url = new URL(request.url)
    const latitude = url.searchParams.get('latitude')
    const daily = url.searchParams.get('daily')
    const current = url.searchParams.get('current')
    const hourly = url.searchParams.get('hourly')
    const temperature_unit_text = url.searchParams.get('temperature_unit')
    const temperature_unit = '°' + temperature_unit_text[0].toUpperCase()
    const mockTemperature_2m_max = {
      '0.1': 1,
      '1.1': 11
    }[latitude]

    const data = {
      "latitude": 40.710335,
      "longitude": -73.99309,
      "generationtime_ms": 0.07700920104980469,
      "utc_offset_seconds": -18000,
      "timezone": "America/New_York",
      "timezone_abbreviation": "EST",
      "elevation": 51.0,
      ...current && {
        "current_units": {
          "time": "iso8601",
          "interval": "seconds",
          "temperature_2m": temperature_unit
        },
        "current": {
          "time": "2024-12-07T15:15",
          "interval": 900,
          "temperature_2m": mockTemperature_2m_max
        }
      },
      ...daily && {
        "daily_units": {
          "time": "iso8601",
          "temperature_2m_max": temperature_unit,
          "temperature_2m_min": temperature_unit
        },
        "daily": {
          "time": [
            "2024-12-04",
            "2024-12-05",
            "2024-12-06",
            "2024-12-07",
            "2024-12-08",
            "2024-12-09",
            "2024-12-10"
          ],
          "temperature_2m_max": [
            mockTemperature_2m_max,
            4.0,
            1.4,
            2.5,
            8.2,
            10.1,
            12.4
          ],
          "temperature_2m_min": [
            -4.0,
            -1.5,
            -3.5,
            -1.1,
            0.3,
            5.1,
            10.5
          ]
        }
      },
      ...hourly && {
        "hourly_units": {
          "time": "iso8601",
          "relative_humidity_2m": "%"
        },
        "hourly": {
          "relative_humidity_2m": [
            49,
            50,
            54,
            52,
            52,
            53,
            54,
            52,
            56,
            54,
            50,
            46,
            44,
            40,
            41,
            39,
            38,
            46,
            48,
            54,
            60,
            58,
            54,
            55,
            54,
            58,
            57,
            58,
            59,
            59,
            57,
            55,
            56,
            57,
            53,
            48,
            46,
            46,
            46,
            47,
            50,
            59,
            63,
            65,
            66,
            72,
            72,
            71,
            73,
            81,
            80,
            82,
            84,
            90,
            96,
            98,
            98,
            88,
            77,
            77,
            72,
            71,
            95,
            98,
            99,
            99,
            98,
            97,
            97,
            96,
            95,
            94,
            95,
            95,
            93,
            94,
            94,
            94,
            94,
            95,
            95,
            94,
            93,
            91,
            90,
            92,
            93,
            95,
            97,
            97,
            97,
            96,
            96,
            97,
            98,
            99,
            99,
            99,
            99,
            99,
            97,
            99,
            99,
            99,
            99,
            97,
            96,
            97,
            94,
            89,
            89,
            88,
            84,
            84,
            84,
            85,
            83,
            82,
            85,
            88,
            81,
            83,
            80,
            71,
            66,
            62,
            63,
            63,
            60,
            56,
            52,
            47,
            42,
            38,
            36,
            35,
            35,
            35,
            36,
            36,
            36,
            35,
            34,
            33,
            33,
            33,
            34,
            35,
            36,
            38,
            40,
            41,
            40,
            38,
            36,
            34,
            32,
            30,
            30,
            30,
            31,
            32,
            34,
            35,
            36,
            37,
            37,
            37
          ]
        }
      }
    };
    return HttpResponse.json(
      data
    );
  }),


];
