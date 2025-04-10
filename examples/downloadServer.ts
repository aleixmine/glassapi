/// <reference types="../src/GlassAPI.d.ts" />

namespace zip {
    export function configure(arg0: { useWebWorkers: boolean; }) {}
    export class BlobWriter{

    }
    export class ZipWriter{
        constructor (a:any) {

        }
        add (a:any,e:any) {}
        close () {return new Blob()}
    }
    export class TextReader{
        constructor (a:any) {

        }
    }
    export class Uint8ArrayReader{
        constructor (a:any) {

        }
    }
}
async function downloadServer() {
    let web = new GlassAPI.util.WebResourceManager();
    await web.loadScript("/libs/zip-fs-full.min.js");
    zip.configure({ useWebWorkers: true });
    const paperMCAPI = new window.GlassAPI.util.PaperMCAPI();
    const latestBuild = await paperMCAPI.getProjectLatestBuild("paper", "1.8.8");
    const paperData = await paperMCAPI.getDownloadProject("paper", "1.8.8", latestBuild!);
    const velocityData = await paperMCAPI.getProjectDownloadLatest("velocity");
    const blobWriter = new zip.BlobWriter();
    const zipWriter = new zip.ZipWriter(blobWriter);
    await Promise.all(
        [
            zipWriter.add('host/server/start.sh', new zip.TextReader(atob("IyEvdXNyL2Jpbi9lbnYgc2gKamF2YSAtWG1zNDA5Nk0gLVhteDQwOTZNIC1YWDorQWx3YXlzUHJlVG91Y2ggLVhYOitEaXNhYmxlRXhwbGljaXRHQyAtWFg6K1BhcmFsbGVsUmVmUHJvY0VuYWJsZWQgLVhYOitQZXJmRGlzYWJsZVNoYXJlZE1lbSAtWFg6K1VubG9ja0V4cGVyaW1lbnRhbFZNT3B0aW9ucyAtWFg6K1VzZUcxR0MgLVhYOkcxSGVhcFJlZ2lvblNpemU9OE0gLVhYOkcxSGVhcFdhc3RlUGVyY2VudD01IC1YWDpHMU1heE5ld1NpemVQZXJjZW50PTQwIC1YWDpHMU1peGVkR0NDb3VudFRhcmdldD00IC1YWDpHMU1peGVkR0NMaXZlVGhyZXNob2xkUGVyY2VudD05MCAtWFg6RzFOZXdTaXplUGVyY2VudD0zMCAtWFg6RzFSU2V0VXBkYXRpbmdQYXVzZVRpbWVQZXJjZW50PTUgLVhYOkcxUmVzZXJ2ZVBlcmNlbnQ9MjAgLVhYOkluaXRpYXRpbmdIZWFwT2NjdXBhbmN5UGVyY2VudD0xNSAtWFg6TWF4R0NQYXVzZU1pbGxpcz0yMDAgLVhYOk1heFRlbnVyaW5nVGhyZXNob2xkPTEgLVhYOlN1cnZpdm9yUmF0aW89MzIgLUR1c2luZy5haWthcnMuZmxhZ3M9aHR0cHM6Ly9tY2ZsYWdzLmVtYy5ncyAtRGFpa2Fycy5uZXcuZmxhZ3M9dHJ1ZSAtamFyIHBhcGVyLmphciBub2d1aQ=="))),
            zipWriter.add('host/server/start.bat', new zip.TextReader(atob("QGVjaG8gb2ZmCmphdmEgLVhtczQwOTZNIC1YbXg0MDk2TSAtWFg6K0Fsd2F5c1ByZVRvdWNoIC1YWDorRGlzYWJsZUV4cGxpY2l0R0MgLVhYOitQYXJhbGxlbFJlZlByb2NFbmFibGVkIC1YWDorUGVyZkRpc2FibGVTaGFyZWRNZW0gLVhYOitVbmxvY2tFeHBlcmltZW50YWxWTU9wdGlvbnMgLVhYOitVc2VHMUdDIC1YWDpHMUhlYXBSZWdpb25TaXplPThNIC1YWDpHMUhlYXBXYXN0ZVBlcmNlbnQ9NSAtWFg6RzFNYXhOZXdTaXplUGVyY2VudD00MCAtWFg6RzFNaXhlZEdDQ291bnRUYXJnZXQ9NCAtWFg6RzFNaXhlZEdDTGl2ZVRocmVzaG9sZFBlcmNlbnQ9OTAgLVhYOkcxTmV3U2l6ZVBlcmNlbnQ9MzAgLVhYOkcxUlNldFVwZGF0aW5nUGF1c2VUaW1lUGVyY2VudD01IC1YWDpHMVJlc2VydmVQZXJjZW50PTIwIC1YWDpJbml0aWF0aW5nSGVhcE9jY3VwYW5jeVBlcmNlbnQ9MTUgLVhYOk1heEdDUGF1c2VNaWxsaXM9MjAwIC1YWDpNYXhUZW51cmluZ1RocmVzaG9sZD0xIC1YWDpTdXJ2aXZvclJhdGlvPTMyIC1EdXNpbmcuYWlrYXJzLmZsYWdzPWh0dHBzOi8vbWNmbGFncy5lbWMuZ3MgLURhaWthcnMubmV3LmZsYWdzPXRydWUgLWphciBwYXBlci5qYXIgbm9ndWkKcGF1c2U="))),
            zipWriter.add('host/proxy/start.sh', new zip.TextReader(atob("IyEvdXNyL2Jpbi9lbnYgc2gKamF2YSAtWG1zNDA5Nk0gLVhteDQwOTZNIC1YWDorQWx3YXlzUHJlVG91Y2ggLVhYOitQYXJhbGxlbFJlZlByb2NFbmFibGVkIC1YWDorVW5sb2NrRXhwZXJpbWVudGFsVk1PcHRpb25zIC1YWDorVXNlRzFHQyAtWFg6RzFIZWFwUmVnaW9uU2l6ZT00TSAtWFg6TWF4SW5saW5lTGV2ZWw9MTUgLWphciB2ZWxvY2l0eS5qYXI="))),
            zipWriter.add('host/proxy/start.bat', new zip.TextReader(atob("QGVjaG8gb2ZmCmphdmEgLVhtczQwOTZNIC1YbXg0MDk2TSAtWFg6K0Fsd2F5c1ByZVRvdWNoIC1YWDorUGFyYWxsZWxSZWZQcm9jRW5hYmxlZCAtWFg6K1VubG9ja0V4cGVyaW1lbnRhbFZNT3B0aW9ucyAtWFg6K1VzZUcxR0MgLVhYOkcxSGVhcFJlZ2lvblNpemU9NE0gLVhYOk1heElubGluZUxldmVsPTE1IC1qYXIgdmVsb2NpdHkuamFyCnBhdXNl"))),
            zipWriter.add('host/server/server.properties', new zip.TextReader(atob("b25saW5lLW1vZGU9ZmFsc2UKc2VydmVyLXBvcnQ9MjU1NjY="))),
            zipWriter.add('host/proxy/velocity.toml', new zip.TextReader(atob("YmluZCA9ICIwLjAuMC4wOjI1NTY1Igptb3RkID0gIjwjMDBBQTAwPlByb3h5ICsgRWFnbGVyQ3JhZnQiCnNob3ctbWF4LXBsYXllcnMgPSA1MDAKb25saW5lLW1vZGUgPSBmYWxzZQpmb3JjZS1rZXktYXV0aGVudGljYXRpb24gPSB0cnVlCnByZXZlbnQtY2xpZW50LXByb3h5LWNvbm5lY3Rpb25zID0gZmFsc2UKcGxheWVyLWluZm8tZm9yd2FyZGluZy1tb2RlID0gImxlZ2FjeSIKZm9yd2FyZGluZy1zZWNyZXQtZmlsZSA9ICJmb3J3YXJkaW5nLnNlY3JldCIKYW5ub3VuY2UtZm9yZ2UgPSBmYWxzZQpraWNrLWV4aXN0aW5nLXBsYXllcnMgPSBmYWxzZQpwaW5nLXBhc3N0aHJvdWdoID0gIkRJU0FCTEVEIgplbmFibGUtcGxheWVyLWFkZHJlc3MtbG9nZ2luZyA9IHRydWUKW3NlcnZlcnNdCnNlcnZlciA9ICIxMjcuMC4wLjE6MjU1NjYiCnRyeSA9IFsic2VydmVyIl0KW2ZvcmNlZC1ob3N0c10KW2FkdmFuY2VkXQpjb21wcmVzc2lvbi10aHJlc2hvbGQgPSAyNTYKY29tcHJlc3Npb24tbGV2ZWwgPSAtMQpsb2dpbi1yYXRlbGltaXQgPSAzMDAwCmNvbm5lY3Rpb24tdGltZW91dCA9IDUwMDAKcmVhZC10aW1lb3V0ID0gMzAwMDAKaGFwcm94eS1wcm90b2NvbCA9IGZhbHNlCnRjcC1mYXN0LW9wZW4gPSBmYWxzZQpidW5nZWUtcGx1Z2luLW1lc3NhZ2UtY2hhbm5lbCA9IHRydWUKc2hvdy1waW5nLXJlcXVlc3RzID0gZmFsc2UKZmFpbG92ZXItb24tdW5leHBlY3RlZC1zZXJ2ZXItZGlzY29ubmVjdCA9IHRydWUKYW5ub3VuY2UtcHJveHktY29tbWFuZHMgPSB0cnVlCmxvZy1jb21tYW5kLWV4ZWN1dGlvbnMgPSBmYWxzZQpsb2ctcGxheWVyLWNvbm5lY3Rpb25zID0gdHJ1ZQphY2NlcHRzLXRyYW5zZmVycyA9IGZhbHNlCltxdWVyeV0KZW5hYmxlZCA9IGZhbHNlCnBvcnQgPSAyNTU2NQptYXAgPSAiVmVsb2NpdHkiCnNob3ctcGx1Z2lucyA9IGZhbHNl"))),
            zipWriter.add('host/server/paper.jar', new zip.Uint8ArrayReader(paperData)),
            zipWriter.add('host/proxy/velocity.jar', new zip.Uint8ArrayReader(velocityData)),
            zipWriter.add('host/proxy/plugins/eagler.jar', new zip.TextReader("xd"))
        ]
    )
    const zipBlob = await zipWriter.close();
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(zipBlob);
    downloadLink.download = 'result.zip';
    downloadLink.click();
}