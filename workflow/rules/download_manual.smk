rule download_manual:
    """
    Download a static figure dependency from Zenodo.

    """
    message:
        "Downloading dependency file {output[0]} from Zenodo..."
    output:
        "{dependency}",
        "{dependency}.zenodo"
    wildcard_constraints:
        dependency="{}".format("|".join(files.zenodo_files_manual))
    params:
        zenodo_url=lambda w: zenodo.zenodo_url[w.dependency],
        deposit_id=lambda w: zenodo.deposit_id[w.dependency],
        file_name=lambda w: zenodo.file_name[w.dependency],
    shell:
        " && ".join(
            [
                "curl https://{params.zenodo_url}/record/{params.deposit_id}/files/{params.file_name} --output {output[0]}", 
                "echo 'https://{params.zenodo_url}/record/{params.deposit_id}' > {output[1]}"
            ]
        )