# CI-työnkulku ja REST-rajapinnan testaus

Tässä tehtävässä toteutat sekä GitHub Actions -työnkulun, että kirjoitat testejä valmiille REST-rajapinnalle. 

Työnkulkusi tulee käynnistää sovellus ja suorittaa kirjoittamasi testit sitä vasten. Lähtötilanteessa repositoriossa ei ole valmista työnkulkua tai testisarjaa eikä testaustyökalua ole valittu. Sinun tulee valita sopiva työkalu, asentaa sen riippuvuudet, kirjoittaa testit ja automatisoida työnkulku.

Työnkulku suoritetaan GitHub Actionsin Linux-runnerilla, joten varmista, että valitsemasi työkalu toimii siinä. Et voi esimerkiksi käyttää graafisia käyttöliittymiä tai VS Code -laajennoksia testien suorittamiseen. Graafiset työkalut ja laajennokset voivat olla hyödyllisiä testien kirjoittamisessa, mutta testit on suoritettava komentoriviltä.

Testattava sovellus löytyy tästä repositoriosta [`app`-kansiossa](./app/README.md). Se tarjoaa yksinkertaisen REST-rajapinnan treenien (workout) hallintaan. Lue sovelluksen README:stä käynnistysohjeet, rajapinnan osoitteet ja odotettu toiminta.

Sovellus käyttää tietojen tallentamiseen paikallista muistia, joten sen toiminta alkaa nollasta jokaisella käynnistyksellä. Testit voivat muuttaa sovelluksen tilaa ja voit esimerkiksi lisätä, hakea ja poistaa niitä. Treenit eivät kuitenkaan säily eri käynnistysten välillä.

## Tausta ja oppimistavoitteet

Aiemmissa testaustehtävissä olet ehkä voinut kokeilla sovellusta käsin esimerkiksi painikkeita klikkaamalla. Tällä kertaa testattavalla sovelluksella ei ole käyttöliittymää: se tarjoaa rajapinnan esimerkiksi toiselle kehitystiimille, joka voi myöhemmin integroida oman sovelluksensa siihen. Miten voit varmistaa, että rajapinta toimii odotetusti jo ennen kuin tuo käyttöliittymä on olemassa?

Pääset valitsemaan itse, miten lähestyt ongelmaa! Voit käyttää tuttua testaustyökalua, kokeilla uutta tai rakentaa testit vaikkapa `curl`-komennoilla ja Bash-skripteillä. Olennaista on, että testit tarkistavat tulokset ja että ne voidaan suorittaa automaattisesti GitHub Actionsissa.

Tehtävän jälkeen osaat:

- testata REST-rajapintaa lähettämällä HTTP-pyyntöjä, käyttämällä autentikointia ja tarkistamalla vastauksia ja virhetilanteita
- valita tehtävään sopivat työkalut ja asentaa niiden riippuvuudet automatisoidussa ympäristössä
- rakentaa CI-työnkulun, joka käynnistää sovellukse ja suorittaa testit
- tulkita työnkulun tuloksia ja havaita testien tai sovelluksen käynnistyksen epäonnistumiset.

> [!TIP]
> Suosittelemme käyttämään kehitysympäristönä [GitHub Codespacesia](https://docs.github.com/en/codespaces/overview) tai paikallista [devcontaineria](https://code.visualstudio.com/docs/devcontainers/containers).
>
> Linux-pohjainen kehityskontti muistuttaa GitHub Actionsin Linux-runneria ja helpottaa riippuvuuksien asentamista eristettyyn ympäristöön.

## Sovelluksen asentaminen ja käynnistäminen

App-hakemistossa sijaitseva testattava sovellus on toteutettu Node.js:llä ja TypeScriptillä käyttäen Hono-frameworkia.

Sinun ei tarvitse tutustua eikä muokata sovelluksen lähdekoodiin, mutta voit halutessasi tehdä niin. Oleellista on, että saat sovelluksen käynnistettyä ja voit lähettää siihen HTTP-pyyntöjä. Sovellus voidaan käynnistää joko suoraan Node.js:llä tai Dockerilla. Valintasi mukaan siis asenna joko Node.js tai Docker.

Asennus- ja käynnistysohjeet löytyvät [sovelluksen README:stä](./app/README.md). Lue se huolellisesti, sillä siinä on myös tietoa rajapinnan osoitteista, odotetuista vastauksista ja virhetilanteista. Sovelluksessa on myös käyttäjätunnukset ja salasanat, jotka löytyvät readme-tiedostosta.

> [!TIP]
> GitHub actionsin Linux-runnerilla ja GitHubin Codespacesilla on valmiiksi asennettuna sekä Node.js että Docker, joten molemmat vaihtoehdot ovat hyviä.


## Tehtävä

1. Tutustu rajapintaan ja käynnistä sovellus paikallisesti tai Docker-kontissa.
2. Kirjoita oma automaattinen testisarja, joka lähettää HTTP-pyyntöjä käynnissä olevaan sovellukseen ja tarkistaa vastaukset. Testaa kirjautuminen ja suojattujen pyyntöjen toiminta myös ilman kelvollista tokenia. 
3. Testaa vähintään workoutin luonti, listaus, haku, päivitys ja poisto sekä virhetilanteita, kuten virheelliset syötteet ja tuntematon ID. Varmista myös päivityksen ja poiston vaikutus. Suunnittele testit niin, etteivät ne riipu aiempien testiajojen tiedoista.
4. Luo työnkulku `.github/workflows/`-kansioon. Määrittele sen käynnistymään vähintään push- ja pull request -tapahtumista. Käytä GitHubin ylläpitämiä uudelleenkäytettäviä actioneita repositorion hakemiseen ja Node.js-ympäristön asentamiseen, esimerkiksi [actions/checkout](https://github.com/actions/checkout) ja [actions/setup-node](https://github.com/actions/setup-node).
5. Asenna työnkulussa sovelluksen riippuvuudet tai hyödynnä Docker compose -tiedosto. Asenna myös valitsemasi testaustyökalun kaikki riippuvuudet. Käynnistä sovellus taustalle samalla runnerilla, jolla testit suoritetaan. Odota, kunnes se vastaa HTTP-pyyntöihin, ennen kuin käynnistät testit; käytä aikarajaa, jotta työnkulku epäonnistuu, jos sovellus ei käynnisty.
6. Suorita testisarjasi työnkulussa käynnissä olevaa sovellusta vasten. Varmista, että epäonnistunut testi tai käynnistysvirhe saa työnkulun epäonnistumaan. Lähetä testit, työnkulku ja mahdolliset riippuvuuksien määritykset GitHubiin ja tarkista suoritus repositorion Actions-välilehdeltä.
7. Lisää työnkulkuusi testien jälkeen samaan jobiin seuraava vaihe. Se suoritetaan myös testien epäonnistuessa, jotta saat palautteen osapisteistä:

   ```yaml
   # Arvioi tehtävän suoritus.
   - name: Autograding
     if: always()
     uses: ohjelmistokehitys/autograder@v0
   ```

Voit valita testaustavan ja -työkalun itse. Esimerkiksi [Robot Framework](https://robotframework.org/), [Vitest](https://vitest.dev/) tai [Bruno CLI](https://docs.usebruno.com/bru-cli/overview) sopivat tehtävään, mutta voit käyttää myös `curl`-komentoja ja Bash-skriptejä. Työkalun on oltava suoritettavissa komentoriviltä automatisoidussa ympäristössä: pelkkä graafinen käyttöliittymä tai VS Code -laajennus ei riitä. Huolehdi myös työkalun tarvitsemasta ajoympäristöstä, kuten Pythonista, ja tallenna riippuvuudet repositorioon toistettavaa asennusta varten.

## Testattavat päätepisteet ja tilanteet

Kirjoita testit seuraaville päätepisteille ja tilanteille. Tarkista kussakin tapauksessa HTTP-tilakoodi ja tarvittaessa vastauksen sisältö, ei pelkästään sitä, että pyyntö onnistuu. Tarkemmat vastausmuodot ja esimerkkikäyttäjät löytyvät [sovelluksen README:stä](./app/README.md).

| Päätepiste | Testattavat tilanteet |
| --- | --- |
| `GET /` | Ilman kirjautumista palautuu tervetuloviesti ja `200`. |
| `GET /health` | Ilman kirjautumista palautuu `200` ja vastaus kertoo kyseessä olevan esimerkinomainen tarkistus. |
| `POST /auth/login` | Oikeilla tunnuksilla palautuu token; väärillä tunnuksilla `401`. Virheellinen JSON sekä puuttuvat tai väärän tyyppiset kentät palauttavat `400`. |
| `GET /workouts` | Kirjautuneena palautuu lista; varmista, että luotu workout näkyy siinä ja poistettu ei enää näy. |
| `POST /workouts` | Kelvollisilla tiedoilla palautuu `201`, luotu workout ja sen ID. Virheelliset syötteet palauttavat `400`. |
| `GET /workouts/:id` | Luotu workout löytyy ID:llä ja sen tiedot ovat oikein. Tuntematon ID palauttaa `404`. |
| `PUT /workouts/:id` | Kelvollinen päivitys palauttaa `200`, säilyttää ID:n ja muuttaa tiedot myös myöhemmässä haussa. Virheelliset syötteet palauttavat `400`, tuntematon ID `404`. |
| `DELETE /workouts/:id` | Luodun workoutin poisto palauttaa `204` ja tyhjän vastauksen. Poistettu tai tuntematon ID palauttaa myöhemmin `404`. |

Testaa myös jokaisen suojatun workout-päätepisteen kohdalla, että puuttuva tai virheellinen token palauttaa `401`. Kokeile luonnissa ja päivityksessä esimerkiksi puuttuvia kenttiä, tyhjää nimeä, virheellistä kestoa, ylimääräisiä kenttiä ja virheellistä JSONia. Varmista, ettei epäonnistunut päivitys muuta tallennettuja tietoja.

## Pisteytys

Saat osan tehtävän pisteistä, kun työnkulku asentaa riippuvuudet ja käynnistää sovelluksen onnistuneesti.

Loput pisteistä saat omista testeistäsi: niiden tulee kattaa yllä kuvatut tilanteet, tarkistaa tulokset ja toimia GitHub Actionsissa. Voit siis saada osapisteitä, vaikka testisarjasi ei olisi vielä valmis.

## Vinkkejä

- Työnkulun komennot suoritetaan runnerilla; palvelin ja testit voivat käyttää samaa `http://localhost:3000`-osoitetta. Työvaiheiden oletushakemisto on repositorion juuri, joten huomioi `app`-kansio asennuksessa ja käynnistyksessä.
- Bashissa `&` käynnistää komennon taustalle. Katso [Bashin ohje taustaprosesseista](https://www.gnu.org/software/bash/manual/html_node/Lists.html) ja [GitHub Actionsin työnkulun syntaksi](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax). Pelkkä taustakäynnistys ei tarkoita, että palvelin on jo valmis.
- Voit odottaa valmiutta esimerkiksi kokeilemalla `GET /health` -pyyntöä `curl`-komennolla toistuvasti rajatun ajan ennen testien suorittamista. Tutustu [curlin uudelleenyrityksiin](https://everything.curl.dev/usingcurl/downloads/retry.html): esimerkiksi `--retry`, `--retry-connrefused` ja `--retry-max-time` auttavat odottamaan palvelimen käynnistymistä. Määritä myös yksittäisen pyynnön aikaraja ja varmista, että epäonnistunut tarkistus pysäyttää testivaiheen. Pelkkä kiinteä `sleep` ei varmista, että palvelin on valmis.
- `/health` ei vaadi tokenia, ja se vastaa `200`, kun palvelin vastaa. Kyseessä on vain esimerkinomainen tarkistus: se ei tarkista sovelluksen tilaa tai riippuvuuksia. Selvitä myös, miten havaitset käynnistysvirheen ja miten näet sovelluksen lokit epäonnistuessa.
- Sovelluksen README sisältää esimerkkikäyttäjät ja ohjeet tokenin hakemiseen. Hae token testiajon aikana, sillä se vanhenee ja muuttuu sovelluksen käynnistyessä uudelleen.
- Kun testaat yksittäistä workoutia, käytä luontivastauksen ID:tä. Sovellus käynnistyy tyhjällä tietovarastolla, mutta testit voivat muuttaa sitä saman ajon aikana.
