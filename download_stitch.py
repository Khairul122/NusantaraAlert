import os
import urllib.request

os.makedirs('stitch_downloads', exist_ok=True)

downloads = [
  ('https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBKOARIhYXBwX2NvbXBhbmlvbl91c2VyX3VwbG9hZGVkX2ZpbGVzGmkKM3VzZXJfdXBsb2FkZWRfaHRtbF8wMDA2NTkxNWY4NmIyNDE2MDkyNWQxYjRiZDI2ODU0NBILEgcQo8219voCGAGSASQKCnByb2plY3RfaWQSFkIUMTY1NDQwOTQ3ODEyMDk4OTI0Mjg&filename=&opi=89354086', 'stitch_downloads/stitch.md'),
  ('https://lh3.googleusercontent.com/aida/AP1WRLv1_DELxD-6_Ry-BFiG36uxqRgSP9gCLJB-HGIeJHd_QYHZ7XMEo1fFldlbH5_4O03PK36lTpKKlMZFubQEZVq9-JkTVvMOyTpbUrx65Eu3K2yBmoqNeLJWd0cM_1mVyuKG1g8E7GPT8uOV1ue3Dq_edWdkYyNPPCuzYPrFXb2LmxBBe18yAZ7f8Dfl4x8Hm4p-TXKh1n7QwkwHJ_nE-6FEq51C0MRQEBCkg8yNVCVAb9jxytlS2rlTkz-5', 'stitch_downloads/dashboard_utama.png'),
  ('https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OTE1ZmQwMzFjYzQwMmQzYzI1YzEwM2I5NjE0EgsSBxCjzbX2-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjU0NDA5NDc4MTIwOTg5MjQyOA&filename=&opi=89354086', 'stitch_downloads/dashboard_utama.html'),
  ('https://lh3.googleusercontent.com/aida/AP1WRLtlWDytsvL1QrdTmNuwUQ9pI7S9__qTZeBchizX0tDizaSwyW16QruZur6MkZrXIg4ICObBJamAJCy0yoCTOvIAxz1pYoZDuvWXE8KNj9TKXkmhSx4Sg3RCba7TZIuO-To700LF6BMsVQEzDg5-n0GVSJ7zlcvnx6Ouz62_Fg4HLrFEX-E_DjRZBw4ND-kEfXkzVGWjN2TK6fsd4_HeGHvgl5Va6zAzilRCpcBC-lv-arUV4ZvAxIrrUwLv', 'stitch_downloads/riwayat_gempa.png'),
  ('https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OTE1ZmQ3YTRjYjAwNzc5OWQ0MTdlMDc5MzZkEgsSBxCjzbX2-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjU0NDA5NDc4MTIwOTg5MjQyOA&filename=&opi=89354086', 'stitch_downloads/riwayat_gempa.html'),
  ('https://lh3.googleusercontent.com/aida/AP1WRLsaOlRbYCXbl-TNhScFjJUDgXeVSHTaxz_ZsOzRn9pjnho5nV-G7-IEKW90jizeT8-ZVARzlsQtp3soUcRu3uN6Bpj8LQr9EOpvCQCtGvFnUhM8tBkbv-kDVjkGoeWd7pF4rrQNTGWJPqst4xZu1uOWYan-CdOejdLoRBiDAcAawFo1r8ROtXbH0PT0JovYmMCRF9MHZhZv20wnU9XyYs_gtk-KU2g5UWbyb5nQ1NbpSHiY7y-oGeUdlBPa', 'stitch_downloads/dashboard_utama_mobile.png'),
  ('https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OTE2MDVhM2NhMDMwN2M0ZTJkMzgzMzYwMGI1EgsSBxCjzbX2-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjU0NDA5NDc4MTIwOTg5MjQyOA&filename=&opi=89354086', 'stitch_downloads/dashboard_utama_mobile.html'),
  ('https://lh3.googleusercontent.com/aida/AP1WRLtY7plMmv87Au4Pg6aK6PlgkOYsJBw8pJfRoE_AgGZIxoEakHBHYyAqHiZhdzqfgt_7eZxz-YY-iio56oRI0q3r8g0Yjz1AiPZ_JLgQBlt83dmbvYWrWZ70uiONUloR8DQnyS5bl0umqbPfkE4WUHGabU76eLlUvm5TxySIXqYmTVpn0UzZaQsYRwaoGFaociNZqOJDhNvl4yIjirRHOzL12cGVYiPcs6Ywm55frO1Pbr_dhvAO55RjK_EI', 'stitch_downloads/prakiraan_cuaca_mobile.png'),
  ('https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OTE2MDUwMzM0YTMwMWI0ZTNiY2U0MzVjZjIyEgsSBxCjzbX2-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjU0NDA5NDc4MTIwOTg5MjQyOA&filename=&opi=89354086', 'stitch_downloads/prakiraan_cuaca_mobile.html'),
  ('https://lh3.googleusercontent.com/aida/AP1WRLsS0cz_7kTxRa-z7-1m25mnTXYBasOWTX7tHuwBnDDfSKLE1jzOYGLu9j8WZmQXmYe7jfkJKrx60-JV9xZAysXvtYDJFKpr4C45gCWqSLkUmpgjcCle9nr5P3Np1iQr5eD_jAuD4FWsFu2wywsAlhw2ok4NiLp8rK6FINvbG3_4xXdVPyJ4gNkszzP_k-L_gIl6PhdROKrdaTBd9OYWIz3sdwtIW97D0j1i2-NEZY9D0AwDlADUcHIrlpA', 'stitch_downloads/kontak_panduan_mobile.png'),
  ('https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OTE2MDUxZWZmN2UwOTI1ZDNiNjFiMTQ4ZWUwEgsSBxCjzbX2-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjU0NDA5NDc4MTIwOTg5MjQyOA&filename=&opi=89354086', 'stitch_downloads/kontak_panduan_mobile.html'),
  ('https://lh3.googleusercontent.com/aida/AP1WRLv0KK9y_yNK6lCCV1HM8LqLEvjFbGUKchF5G-XJpvCyscEj12jTJ0xwZQB_r0kNGCTKDy1oQ_bbTHD3JKj_sL8AnhKqgB85ocVqmGrPcLAbwzcLuCXpB3cNERo6D2pUDukLTmJONTlMjMDcwHD-GaH1x6oqr-eRLZLLLLw2CV6exuu-yZF0ArhEXsJERhlo_EFQCTW45y4D8f8b6v-8eUkkQ6zTb9_cBpdeQZF5XKPeN4oYlOIlZxxLUvFh', 'stitch_downloads/riwayat_gempa_mobile.png'),
  ('https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OTE2MDUyZDJkOWIwMWI0ZTVkZDFmMjk5ZGU3EgsSBxCjzbX2-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjU0NDA5NDc4MTIwOTg5MjQyOA&filename=&opi=89354086', 'stitch_downloads/riwayat_gempa_mobile.html'),
  ('https://lh3.googleusercontent.com/aida/AP1WRLv8cxnTGD00leUuaCgC9TPb8CvrEhHPxVD1jERtvx72nlSMY-UzRD42wZYGtyl6izH0mN7UKeu-Fwg4naHXsZI8xknm75n2g1t7f7PugMbvIgVhQGlnaOKGKw97Kc-rXY1G6X9J2HLi6VyEPiGh4sYwoe1jM5N0rdEVQ0Hmt4fbdBXVXlt8tWpDeQVInjMdwA31hSBYJ_553miqXut8UR2aVaJwLEQDdNfOhBFEdYNlLqIRJ5HlGOtkXdjL', 'stitch_downloads/detail_gempa_mobile.png'),
  ('https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OTE2MGM0ODE4ZWMwMzM4NDlhOWMyMjVlNjdmEgsSBxCjzbX2-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjU0NDA5NDc4MTIwOTg5MjQyOA&filename=&opi=89354086', 'stitch_downloads/detail_gempa_mobile.html'),
  ('https://lh3.googleusercontent.com/aida/AP1WRLvE2RcP9qhKk-pC_XFczBACqASaTUJui3tAho9zVAJ70lbe8D2tQOfKTFmDoyZmkD-sdwcqi1hb7u2LV29Ud08dOmS4Rm1uHNXxovZ2j5jse2XvWerjvFmzexKwC1-3VRTBtWSsLHE0mO5DnXcBvI9kArAvaS26iC1_UkSi1Bng0mrSIpzg9G-BC15uLScO3vzzmDspjBvo7sRHfGvmlUx-2Xb7R-nxccV4ExpTraIGQAYax7Jh-7ML4mj3', 'stitch_downloads/prakiraan_cuaca.png'),
  ('https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OTE1ZmM5NzVmZWIwNTNiNzVlMWMxMWQ5ZjRiEgsSBxCjzbX2-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjU0NDA5NDc4MTIwOTg5MjQyOA&filename=&opi=89354086', 'stitch_downloads/prakiraan_cuaca.html'),
  ('https://lh3.googleusercontent.com/aida/AP1WRLupLG-tbxoMeLe14Dy2Oj1Ke3SSE8cGYxbFi_XDGJ_KdPqVS7E1JwzzSDrjLx0IMY1pqZsEMEDDKKSFtSgLWD29aFYIb6c1q8Zk7xHzgV5ADln7xjMvMW9vNwd5y4yy524uNvfuVwA70zLOKN2YGO1rGZZFge2Ys_eSYRqfh4lV5CAwl333E0sKwzgIFIuzHYK5SN9cCRU4QgdPvxaKv8EPT_fvasJdV9k8tiUvnHeYt4APjbEL1Xj2cDLq', 'stitch_downloads/kontak_panduan.png'),
  ('https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OTE1ZmNhYjZlMjUwN2M0ZTJhYTMzMDAwNmYwEgsSBxCjzbX2-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjU0NDA5NDc4MTIwOTg5MjQyOA&filename=&opi=89354086', 'stitch_downloads/kontak_panduan.html')
]

for url, out_path in downloads:
    print(f"Downloading {out_path}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp, open(out_path, 'wb') as f:
            f.write(resp.read())
        print(f"Success: {out_path}")
    except Exception as e:
        print(f"Error downloading {out_path}: {e}")

print("Finished downloads!")
